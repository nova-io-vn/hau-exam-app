import { Client } from '@stomp/stompjs';
import { WS_BASE_URL } from '@/src/config/env';
import { getAccessToken } from '@/src/services/api';

const disconnectors = new Set<() => void>();
export type GatewaySocketDisconnect = (() => void) & { sendTyping: (conversationId: string, typing: boolean) => void };
export function disconnectGatewaySocket() { disconnectors.forEach(disconnect => disconnect()); disconnectors.clear(); }

export function connectGatewaySocket({ onMessage, onSupport, onStatus }: { onMessage: (message: unknown) => void; onSupport?: (message: unknown) => void; onStatus?: (status: 'connecting' | 'connected' | 'disconnected') => void }): GatewaySocketDisconnect {
  if (!WS_BASE_URL) { const unavailable = (() => undefined) as GatewaySocketDisconnect; unavailable.sendTyping = () => undefined; return unavailable; }
  const client = new Client({ brokerURL: `${WS_BASE_URL}/ws`, reconnectDelay: 5000, connectionTimeout: 10000, heartbeatIncoming: 10000, heartbeatOutgoing: 10000, connectHeaders: {} });
  client.beforeConnect = async () => { const token = getAccessToken(); client.connectHeaders = token ? { Authorization: `Bearer ${token}` } : {}; onStatus?.('connecting'); };
  client.onConnect = () => { onStatus?.('connected'); client.subscribe('/user/queue/notifications', message => { try { onMessage(JSON.parse(message.body)); } catch { /* ignore malformed realtime payload */ } }); if (onSupport) client.subscribe('/user/queue/support', message => { try { onSupport(JSON.parse(message.body)); } catch { /* ignore malformed realtime payload */ } }); };
  client.onWebSocketClose = () => onStatus?.('disconnected');
  client.onStompError = () => onStatus?.('disconnected');
  client.activate();
  const disconnect = (() => { void client.deactivate(); }) as GatewaySocketDisconnect;
  disconnect.sendTyping = (conversationId, typing) => { if (client.connected && conversationId) client.publish({ destination: '/app/support/typing', body: JSON.stringify({ conversationId, typing }) }); };
  disconnectors.add(disconnect);
  const cleanup = (() => { disconnect(); disconnectors.delete(disconnect); }) as GatewaySocketDisconnect;
  cleanup.sendTyping = disconnect.sendTyping;
  return cleanup;
}
