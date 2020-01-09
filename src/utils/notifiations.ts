import { notification } from 'antd';

export const openNotification =
    (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info', description?: string) => {
        notification[type]({
            message,
            description,
            placement: 'bottomRight',
        });
    }
