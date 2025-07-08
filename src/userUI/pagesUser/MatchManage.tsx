import React, { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleFont } from '../fonts/fonts'
import Components from "../componentUser"
import {getMatchAvailable,addMatchRequest,viewRequestMatch,changeMatchRequestStatus} from '../apiUser/PublicServices';
import {getAllOpponentMatches} from '../apiUser/PublicServices';
import Notification from "../componentUser/Notification"
import { parse } from 'path';
import Modal from 'antd/es/modal/Modal';


interface NotiItem {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}




export default function MatchManage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const fontFamily = useGoogleFont('Inter');

  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [availableMatches, setAvailableMatches] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]);
  const [matchRequests, setMatchRequests] = useState([]);
  const [modal, setModal] = useState<{ open: boolean; message: string; success: boolean }>({ open: false, message: '', success: true });
  const [notifications, setNotifications] = useState<NotiItem[]>([]);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; request: any }>(
    { open: false, request: null }
  );
  const [sentOpen, setSentOpen] = useState(true);
  const [receivedOpen, setReceivedOpen] = useState(true);

  const sentRequests = matchRequests.filter(r => r.isMine);
  const receivedRequests = matchRequests.filter(r => !r.isMine);


  const fetchDataByTab = async (tab: string, userid: string) => {
    switch (tab) {
      case 'upcoming':{
        // Gọi API lấy trận đấu sắp tới
        // const res = await apiGetUpcoming();
    
        const res = await  getAllOpponentMatches(parseInt(userid, 10));    
        setUpcomingMatches(res.data.data);
        break;
      }
       case 'send': {
        // Gọi API lấy danh sách các sân có thể apply gửi request 
        const res = await getMatchAvailable(parseInt(userid, 10));    
        setAvailableMatches(res.data.data);
        break;
      }
      case 'history':
        // Gọi API lấy lịch sử trận đấu
        // const res = await apiGetHistory();
        // setMatchHistory(res.data);
        
        break;
      case 'requests': {
        // Gọi API lấy lời mời thi đấu
        // const res = await apiGetRequests();
        // setMatchRequests(res.data);
        const reshistory = await viewRequestMatch(parseInt(userid, 10));
        console.log(reshistory.data.data);
        setMatchRequests(reshistory.data.data);
        break;
      }
      default:
        break;
    }
  };



  const handleSendRequest = async (match: any) => {
    // Xử lý logic gửi yêu cầu ở đây, ví dụ:
    const userId = sessionStorage.getItem('userid');
    try {
      const response = await addMatchRequest(parseInt(userId, 10), match);
      if (response.status === 200) {
        pushNotification('success', 'Gửi yêu cầu thành công!');
        fetchDataByTab(activeTab, userId);
      } else {
        pushNotification('error', 'Gửi thất bại!');
      }
    } catch (error) {
      pushNotification('error', 'Gửi thất bại!');
    }
    
  };

  const handleChangeRequestStatus = async (requestWithStatus: any) => {
    // Xử lý gọi API đổi trạng thái ở đây
    // Ví dụ: await changeMatchRequestStatus(requestWithStatus);
    const userId = sessionStorage.getItem('userid');
     try {
      const response2 = await changeMatchRequestStatus(requestWithStatus);
      if (response2.status === 200) {
        pushNotification('success', 'Đã chấp nhận đối thủ. Chúc bạn thi đấu vui vẻ!');
        fetchDataByTab(activeTab, userId);
      } else {
        pushNotification('error', 'Gửi thất bại!');
      }
    } catch (error) {
      pushNotification('error', 'Vui lòng chờ trong giây lát!');
    }
   
  };


  const pushNotification = (type: NotiItem['type'], message: string) => {
  setNotifications((prev) => [
    ...prev,
    {
      id: Date.now(),
      type,
      message,
    },
  ]);
};

  // const upcomingMatches = [
  //   { id: 1, teams: 'Team A vs Team B', date: 'Nov 15, 2023, 6:00 PM', location: 'Central Park', status: 'Awaiting Check-in' },
  //   { id: 2, teams: 'Team C vs Team D', date: 'Nov 20, 2023, 10:00 AM', location: 'Grant Park', status: 'Checked In' },
  // ];

  // const matchHistory = [
  //   { id: 1, opponent: 'John Doe', result: 'Win', score: '3 - 1', date: 'Nov 5, 2023' },
  //   { id: 2, opponent: 'Jane Smith', result: 'Loss', score: '1 - 2', date: 'Oct 30, 2023' },
  //   { id: 3, opponent: 'Alex Johnson', result: 'Draw', score: '2 - 2', date: 'Oct 25, 2023' },
  // ];

  // const matchRequests = [
  //   { id: 1, opponent: 'John Doe', status: 'Pending', time: 'Nov 10, 2023' },
  //   { id: 2, opponent: 'Jane Smith', status: 'Accepted', time: 'Nov 11, 2023' },
  // ];




  useEffect(() => {
      const userId = sessionStorage.getItem('userid');

      fetchDataByTab(activeTab,userId);
    }, [activeTab]);



  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily }}>
          {/* Navbar */}
          <Components.NavbarUser cartItemCount={2} />
    <div className="max-w-6xl mx-auto px-4 py-8 pt-40">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Quản Lý Trận Đấu
        </h1>
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        {[
          { key: 'upcoming', label: 'Trận Đấu Sắp Tới' },
          { key: 'send', label: 'Tìm Đối Thủ' }, 
          // { key: 'history', label: 'Lịch Sử Trận Đấu' },
          { key: 'requests', label: 'Lời Mời Thi Đấu' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-full transition font-medium text-sm ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
          {activeTab === 'upcoming' && (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl min-h-[500px] space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white border-b pb-2">
                📅 Trận Đấu Sắp Tới
              </h2>

              {upcomingMatches.map(match => (
                <div
                  key={match.id}
                  className="relative flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl min-h-[122px]"

                >
                            {/* Status góc trên bên phải */}
              <span
                className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full
                  ${match.status === 'Awaiting Check-in'
                    ? 'bg-yellow-100 text-yellow-700'
                    : match.status === 'upcoming'
                    ? 'bg-green-100 text-green-700'
                    : match.status === 'Accepted'
                    ? 'bg-green-100 text-green-700'
                    : match.status === 'Rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-200 text-gray-700'
                  }`}
              >
                {match.status}
              </span>

              {/* Left info */}
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{match.teams}</p>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">📅 {match.date}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">📍 {match.location}</p>
              </div>

                  {/* Buttons */}
                  {/* <div className="flex gap-2 mt-4 md:mt-0 self-end">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition">
                      Check In
                    </button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 shadow transition">
                      Check Out
                    </button>
                  </div> */}
                </div>
              ))}
            </motion.div>
          )}


         {activeTab === 'send' && (
          <motion.div
            key="send"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md min-h-[500px]"
          >
            <h2 className="text-xl font-semibold mb-4">Danh sách trận đấu</h2>
         <div className="flex flex-col gap-6">
  {availableMatches.map((match) => (
    <div
      key={match.id}
      className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition bg-white flex flex-col gap-2 relative"
      style={{ minHeight: 140 }}
    >
      {match.isMine && (
        <span className="absolute top-4 right-4 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold shadow-sm">
          Chủ sân
        </span>
      )}
      <p className="text-xl font-bold text-gray-800 dark:text-white mb-1">{match.teamName}</p>
      <div className="flex items-center text-gray-500 text-sm mb-1 gap-2">
        <span className="inline-flex items-center">
          <svg className="w-4 h-4 mr-1 text-pink-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <circle cx={12} cy={11} r={3} />
          </svg>
          {match.location}
        </span>
      </div>
      <div className="flex items-center text-gray-500 text-sm mb-3 gap-2">
        <span className="inline-flex items-center">
          <svg className="w-4 h-4 mr-1 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M12 8v4l3 3" />
            <circle cx={12} cy={12} r={10} />
          </svg>
          {match.date}
        </span>
      </div>
      {!match.isMine && (
        <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-indigo-700 transition text-base"
          onClick={() => handleSendRequest(match)}
        >
          Gửi yêu cầu
        </button>
      )}
    </div>
  ))}
</div>
          </motion.div>
        )}
        
        {/* {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md overflow-auto min-h-[500px]"
          >
            <h2 className="text-xl font-semibold mb-4">	Lịch Sử Trận Đấu</h2>
            <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-200">
              <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-2">Đối thủ</th>
                  <th className="px-4 py-2">Kết quả</th>
                  <th className="px-4 py-2">Điểm số</th>
                  <th className="px-4 py-2">Ngày thi đấu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {matchHistory.map(match => (
                  <tr key={match.id}>
                    <td className="px-4 py-3">{match.opponent}</td>
                    <td className="px-4 py-3">{match.result}</td>
                    <td className="px-4 py-3">{match.score}</td>
                    <td className="px-4 py-3">{match.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )} */}

       
{activeTab === 'requests' && (
  <motion.div
    key="requests"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3 }}
    className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md min-h-[500px]"
  >
    <h2 className="text-xl font-semibold mb-4">Lời Mời Thi Đấu</h2>

    {/* Dropdown: Lời mời bạn đã gửi */}
    <div className="mb-6">
      <button
        className="flex items-center gap-2 font-semibold text-blue-700 mb-2"
        onClick={() => setSentOpen((v) => !v)}
      >
        <span>{sentOpen ? "▼" : "►"}</span>
        Lời mời bạn đã gửi
        <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{sentRequests.length}</span>
      </button>
      {sentOpen && (
        <div className="flex flex-col gap-4">
          {sentRequests.length === 0 && <div className="text-gray-400 italic">Không có lời mời nào.</div>}
          {/* Item Component - dùng lại được cho cả sent/received */}
{sentRequests.map(request => (
  <div
    key={request.id}
    className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
  >
    <img
      src={request.urlImage}
      alt={request.fieldName}
      className="w-24 h-16 rounded-xl object-cover shadow"
    />

    <div className="flex-1 ">
      <div className="flex justify-between items-center mb-1">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">Tên đối thủ: {request.userName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">Sân: {request.fieldName}</p>
        </div>
        <span
          className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
            request.status === 'Pending'
              ? 'bg-yellow-100 text-yellow-700'
              : request.status === 'Accepted'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {request.status}
        </span>
      </div>

     
      <p className="text-sm text-gray-400 dark:text-gray-400">
          Gửi vào ngày: <span className="font-medium"> {request.requestedAt
        ? request.requestedAt.replace('T', ' ').substring(0, 16).replace(/-/g, '/')
        : ''}</span>
      </p>
      {/* Only show buttons for received */}
      {!request.isMine && (
        <div className="flex mt-4 gap-2">
          <button className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition"
           onClick={() => handleChangeRequestStatus({ ...request, newStatus: 'Accepted' })}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
            Accept
          </button>
          <button className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reject
          </button>
        </div>
      )}
    </div>
  </div>
))}



        </div>
      )}
    </div>

    {/* Dropdown: Lời mời gửi đến cho bạn */}
    <div>
      <button
        className="flex items-center gap-2 font-semibold text-green-700 mb-2"
        onClick={() => setReceivedOpen((v) => !v)}
      >
        <span>{receivedOpen ? "▼" : "►"}</span>
        Lời mời gửi đến cho bạn
        <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">{receivedRequests.length}</span>
      </button>


      {receivedOpen && (
        <div className="flex flex-col gap-4">
          {receivedRequests.length === 0 && <div className="text-gray-400 italic">Không có lời mời nào.</div>}
       
          {/* Item Component - dùng lại được cho cả sent/received */}
{receivedRequests.map(request => (
  <div
    key={request.id}
    className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
  >
    <img
      src={request.urlImage}
      alt={request.fieldName}
      className="w-24 h-16 rounded-xl object-cover shadow"
    />

    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">Tên đối thủ: {request.userName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">Sân: {request.fieldName}</p>
        </div>
        <span
          className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
            request.status === 'Pending'
              ? 'bg-yellow-100 text-yellow-700'
              : request.status === 'Accepted'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {request.status}
        </span>
      </div>

      <p className="text-sm text-gray-400 dark:text-gray-400">
        Gửi vào ngày: <span className="font-medium"> {request.requestedAt
      ? request.requestedAt.replace('T', ' ').substring(0, 16).replace(/-/g, '/')
      : ''}</span>
      </p>

      {/* Only show buttons for received */}
      {!request.isMine && request.status === 'Pending' && (
        <div className="flex mt-4 gap-2">
          <button className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition"
           onClick={() => setConfirmModal({ open: true, request })}
        //  onClick={() => handleChangeRequestStatus({ ...request, newStatus: 'Accepted' })}
         >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
            Accept
          </button>
          <button className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reject
          </button>
        </div>
      )}
    </div>
  </div>
))}




        </div>
      )}
    </div>
  </motion.div>
)}


      </AnimatePresence>
    </div>



                
      {modal.open && (
        <div className="fixed top-8 right-8 z-50">
          <div className={`flex items-center px-6 py-4 rounded-lg shadow-lg transition-all duration-300
            ${modal.success ? 'bg-green-50 border border-green-400' : 'bg-red-50 border border-red-400'}`}>
            <span className={`mr-3 text-2xl ${modal.success ? 'text-green-500' : 'text-red-500'}`}>
              {modal.success ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </span>
            <div>
              <div className={`font-semibold ${modal.success ? 'text-green-700' : 'text-red-700'}`}>
                {modal.success ? 'Thành công' : 'Thất bại'}
              </div>
              <div className="text-gray-700 text-sm">{modal.message}</div>
            </div>
            <button
              className="ml-6 text-gray-400 hover:text-gray-700"
              onClick={() => setModal({ ...modal, open: false })}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}


      <div className="fixed top-6 right-4 w-full max-w-xs z-50">
        {notifications.map((n) => (
          <Notification
            key={n.id}
            type={n.type}
            message={n.message}
            onClose={() =>
              setNotifications((prev) => prev.filter((item) => item.id !== n.id))
            }
          />
        ))}
      </div>

        {confirmModal.open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Xác nhận chọn đối thủ</h3>
      <p className="mb-4 text-gray-700">
       Khi xác nhận đối thủ này, các lời mời khác sẽ bị từ chối và trận đấu sẽ được lên lịch cố định cho cả hai đội. Bạn sẽ không thể thay đổi sau khi xác nhận.<br />
        <span className="font-semibold">Tên đối thủ: {confirmModal.request?.userName}</span>
      </p>
      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          onClick={() => setConfirmModal({ open: false, request: null })}
        >
          Hủy
        </button>
        <button
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
          onClick={() => {
            handleChangeRequestStatus({ ...confirmModal.request, newStatus: 'Accepted' });
            setConfirmModal({ open: false, request: null });
          }}
        >
          Xác nhận
        </button>
      </div>
    </div>
  </div>
)}
       <Components.FooterUser />
    </div>



  );
}
