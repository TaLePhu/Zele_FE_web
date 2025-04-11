import { io } from 'socket.io-client';
import { create } from 'zustand';

const socket = io('http://localhost:5000');

export { socket };
