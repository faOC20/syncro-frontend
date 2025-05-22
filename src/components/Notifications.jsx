import '@styles/notifications.css'
import { useEffect, useState } from 'react';
import { BACK_API } from 'astro:env/client';

const updateNotifications = async() => {
    const result = await fetch(`${BACK_API}/api/notifications-update`)
    const {data} = await result.json();
    console.log(data)
    return data;
};

export const Notifications = () => {

// Función para obtener el ícono según el tipo de notificación
const getIcon = (alarm) => {
  switch(alarm) {
    case 'alert': return 'fa-exclamation-circle';
    case 'reminder': return 'fa-clock';
    default: return 'fa-bell';
  }
};

// Función para obtener el color según el tipo de notificación
const getColor = (alarm) => {
  switch(alarm) {
    case 'alert': return 'text-red-500';
    case 'reminder': return 'text-yellow-500';
    default: return 'text-gray-500';
  }
};

const [notifications, setNotifications] = useState([]);
const[isLoading, setIsLoading] = useState(true);

useEffect(() => {
    
    const fetchNotifications = async() => {
        const data = await updateNotifications();
        setNotifications(data);
        setIsLoading(false);
        
    }

    fetchNotifications();
    
    
    
}, []);



    return (
       isLoading?(<div className='w-full h-full '>

       </div>):(
        <div id="notifications-container" class="h-full w-full hidden lg:flex flex-col rounded-lg bg-white shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-theme-ocean-blue to-theme-light-blue p-4 text-white">
            <h2 class="text-xl font-bold">Notificaciones</h2>
        </div>
        
        <div class="overflow-y-auto p-2 flex-grow">
            {notifications.length > 0 ? (
                <ul class="space-y-2">
                    {notifications.map((notification) => (
                        <li>
                            <a 
                                class={`w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 flex items-start gap-3 border-l-4 border-theme-ocean-blue`}
                                href={`/operation/${notification.order_number}`}
                            >
                                <div class={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center`}>
                                    <i class={`fas ${getIcon(notification.alarm)} ${getColor(notification.alarm)}`}></i>
                                </div>
                                <div class="flex flex-grow gap-2">
                                    <div class="text-xs flex justify-between items-start max-w-15">
                                        
                                       {notification.message}
                                    </div>
                                    <div className='flex gap-2'>
                                    <h3 class="text-xs text-gray-600 max-w-45">{notification.type} cuota de la orden <span className='text-theme-light-blue'>#{notification.order_number}</span> </h3>
                                    <p class="text-xs text-red-800  ">{notification.date_to_pay}</p>
                                    </div>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <div class="flex flex-col items-center justify-center h-full text-gray-500">
                    <i class="fas fa-bell-slash text-4xl mb-2"></i>
                    <p>No tienes notificaciones</p>
                </div>
            )}
        </div>
        
       
    </div>
       )


    )
}



