export type NotificationTargetType = 'DIARY' | 'MISSION' | 'TRIP' | (string & {});

export type AppNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  targetType?: NotificationTargetType;
  targetId?: string;
  read: boolean;
  createdAt: string;
};
