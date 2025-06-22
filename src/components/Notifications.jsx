import '@styles/notifications.css'
import { useEffect, useState } from 'react';
import { BACK_API } from 'astro:env/client';

const updateNotifications = async() => {
    const result = await fetch(`${BACK_API}/api/notifications-update`,{
        method: 'GET',
        credentials: 'include'
    })
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
       isLoading?(<div className='w-full h-full rounded-lg shadow-lg bg-white overflow-hidden'>
            <div class="bg-gradient-to-r from-theme-ocean-blue to-theme-light-blue p-4 text-white">
            <h2 class="text-lg md:text-xl font-bold">Notificaciones</h2>
        </div>
       </div>):(
        <div class="h-full w-full lg:flex flex-col rounded-lg bg-white shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-theme-ocean-blue to-theme-light-blue p-4 text-white">
            <h2 class="text-lg md:text-xl font-bold">Notificaciones</h2>
        </div>
        
        <div class="overflow-y-auto p-2 flex-grow">
            {notifications.length > 0 ? (
                <ul class="space-y-2">
                    {notifications.map((notification) => (
                        <li>
                            <a 
                                class={`w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 justify-between flex gap-8 border-l-4 border-theme-ocean-blue`}
                                href={`/operation/${notification.order_number}`}
                            >
                                <div class={`rounded-full flex items-center`}>
                                    <i class={`fas ${getIcon(notification.alarm)} ${getColor(notification.alarm)}`}></i>
                                </div>
                                <div class="text-xs flex">
                                        
                                       {notification.message}
                                    </div>
                                <div class="flex grow justify-center">
                                    
                                    <div className='flex gap-5 justify-end w-full'>
                                    <h3 class="text-xs text-gray-600">{notification.type} cuota de la orden <span className='text-theme-light-blue text-center'>#{notification.order_number}</span> </h3>
                                    <p class="flex text-xs min-w-[80px] justify-center text-red-800 grow">{notification.date_to_pay}</p>
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



