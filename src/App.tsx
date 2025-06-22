// import {RouterProvider} from 'react-router-dom';
// import {router} from './pages/router.tsx';
// import {QueryClient, QueryClientProvider} from 'react-query';

// import {ConfigProvider} from 'antd';
// import {AuthContextProvider} from './context/AuthContext.tsx';
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//       staleTime: 60 * 1000 * 5, // 5 minutes
//       retry: 0,
//     },
//     mutations: {
//       retry: 0,
//     },
//   },
// });


// function App() {
//   return (
    
//     <QueryClientProvider client={queryClient}>
//       <ConfigProvider
//         theme={{
//           token: {
//             fontFamily: "IBM Plex Sans",
//             borderRadius: 4,
//           },
//         }}
//       >
       
//         <AuthContextProvider>
//           <RouterProvider router={router}/>
//         </AuthContextProvider>
        
//       </ConfigProvider>
//       {/* <ReactQueryDevtools initialIsOpen={false}/> */}
//     </QueryClientProvider> 
   
//   );
// }

// export default App;
import { RouterProvider } from 'react-router-dom';
import { router } from './pages/router.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';

import { ConfigProvider } from 'antd';
import { AuthContextProvider } from './context/AuthContext.tsx';

import ReactGA from 'react-ga4';

// Measurement ID từ GA
ReactGA.initialize('G-VPCVQ7Z17H'); // <--- Thay bằng mã thật nếu cần

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000 * 5,
      retry: 0,
    },
    mutations: {
      retry: 0,
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: 'IBM Plex Sans',
            borderRadius: 4,
          },
        }}
      >
        <AuthContextProvider>
        
            <RouterProvider router={router}/>
        </AuthContextProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
export default App;
