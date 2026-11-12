// Senders we auto-unsubscribe from by replying STOP.
const AUTO_STOP_SENDERS = new Set([ '66377' ]);

export const isAutoStopSender = (from: string): boolean => AUTO_STOP_SENDERS.has(from);
