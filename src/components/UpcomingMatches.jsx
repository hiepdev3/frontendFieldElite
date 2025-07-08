import React from 'react';
import { motion } from 'framer-motion';

export default function UpcomingMatches  ()  {
  const matches = [
    { id: 1, teams: 'Team A vs Team B', date: 'Nov 15, 2023, 6:00 PM', location: 'Central Park', status: 'Awaiting Check-in' },
    { id: 2, teams: 'Team C vs Team D', date: 'Nov 20, 2023, 10:00 AM', location: 'Grant Park', status: 'Checked In' },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Upcoming Matches</h2>
      <div className="glass-card p-4 rounded-2xl shadow-2xl">
        {matches.map(match => (
          <motion.div
            key={match.id}
            className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div>
              <p className="font-semibold">Teams: {match.teams}</p>
              <p className="text-gray-600 dark:text-gray-400">Date/Time: <span className="font-medium">{match.date}</span></p>
              <p className="text-gray-500 dark:text-gray-500">Location: {match.location}</p>
              <span className={`bg-${match.status === 'Awaiting Check-in' ? 'yellow-100' : 'green-100'} text-${match.status === 'Awaiting Check-in' ? 'yellow-800' : 'green-800'} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                {match.status}
              </span>
            </div>
            <div className="flex space-x-2">
              <button className="bg-indigo-600 text-white rounded-md py-1 px-3 hover:bg-indigo-700 transition duration-300">
                Check In
              </button>
              <button className="bg-indigo-600 text-white rounded-md py-1 px-3 hover:bg-indigo-700 transition duration-300">
                Check Out
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
