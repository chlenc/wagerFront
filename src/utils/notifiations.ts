import { notification } from 'antd';

export const openNotification =
    (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info', description?: string) => {
        notification[type]({
            message,
            description,
            placement: 'bottomRight',
        });
    }

// export const handleError = (f: () => void) => {
//     try {
//         f();
//     } catch (e) {
//         openNotification(e, 'error')
//     }
// }
