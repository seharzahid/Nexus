import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Mic, MicOff, PhoneCall, Video, Users, User2 } from 'lucide-react';

export const VideoCallMock: React.FC = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isCallActive) {
      intervalRef.current = setInterval(() => setDuration((prev) => prev + 1), 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDuration(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isCallActive]);

  const formatDuration = () => {
    const minutes = String(Math.floor(duration / 60)).padStart(2, '0');
    const seconds = String(duration % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="bg-slate-950 px-5 py-4 text-white flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Video Conference</p>
          <h3 className="text-lg font-semibold">Investor Meeting Room</h3>
        </div>
        <div className="text-right text-xs">
          <p className="text-slate-400">Status</p>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${isCallActive ? 'bg-emerald-600/15 text-emerald-300' : 'bg-slate-500/15 text-slate-200'}`}>
            {isCallActive ? 'In call' : 'Ready to start'}
          </span>
        </div>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[1.7fr_0.9fr]">
        <div className="rounded-3xl bg-slate-950 p-5 text-slate-200 h-72 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <div className="inline-flex items-center gap-2"><Video size={16} /> Live preview</div>
            <span>{formatDuration()}</span>
          </div>
          <div className="flex flex-1 items-center justify-center text-center">
            <div>
              <p className="text-xl font-semibold text-white mb-2">{isCallActive ? 'Meeting in progress' : 'Your video session starts here'}</p>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                {isCallActive
                  ? 'Use the controls below to manage audio and video during the mock session.'
                  : 'Click start to begin a professional meeting preview with investor collaboration.'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700"><Users size={18} /></span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Participants</p>
                <p className="text-xs text-slate-500">Investor plus meeting host</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-3xl bg-white p-3 border border-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"><User2 size={16} /></span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Michael Vance</p>
                      <p className="text-xs text-slate-500">VC Partner</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Host</span>
                </div>
              </div>
              <div className="rounded-3xl bg-white p-3 border border-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"><User2 size={16} /></span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">You</p>
                      <p className="text-xs text-slate-500">Founder</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">Presenter</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900 mb-3">Controls</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => setMicOn((prev) => !prev)} className={`rounded-3xl border px-3 py-2 text-sm font-semibold ${micOn ? 'border-slate-300 bg-slate-100 text-slate-900' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                {micOn ? (
                  <span className="inline-flex items-center gap-2"><Mic size={16} /> Mic On</span>
                ) : (
                  <span className="inline-flex items-center gap-2"><MicOff size={16} /> Mic Off</span>
                )}
              </button>
              <button type="button" onClick={() => setCameraOn((prev) => !prev)} className={`rounded-3xl border px-3 py-2 text-sm font-semibold ${cameraOn ? 'border-slate-300 bg-slate-100 text-slate-900' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                {cameraOn ? (
                  <span className="inline-flex items-center gap-2"><Camera size={16} /> Cam On</span>
                ) : (
                  <span className="inline-flex items-center gap-2"><CameraOff size={16} /> Cam Off</span>
                )}
              </button>
            </div>
            <button type="button" onClick={() => setIsCallActive((prev) => !prev)} className={`mt-4 w-full rounded-3xl px-4 py-3 text-sm font-semibold transition ${isCallActive ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-slate-950 text-white hover:bg-slate-800'}`}>
              {isCallActive ? (
                <span className="inline-flex items-center justify-center gap-2"><PhoneCall size={16} /> End Call</span>
              ) : (
                <span className="inline-flex items-center justify-center gap-2"><Video size={16} /> Start Call</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
