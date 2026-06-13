import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CalendarDays, Clock3, User2, Video } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { useAuth } from '../../context/AuthContext';
import { investors } from '../../data/users';
import { VideoCallMock } from '../../components/VideoCallMock';
import { DashboardAnalytics } from './DashboardAnalytics';
interface Meeting {
  id: string;
  investorName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'done' | 'cancelled';
}

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // --- 1. PECHY WALA DATA & ORIGINAL STATES ---
  // --- FILTER STATES & LOGIC FOR INVESTORS ---
  const [selectedInterest, setSelectedInterest] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
// --- WEEK 4: INVESTOR QUICK REMINDER NOTES STATE ---
  const [investorNotes, setInvestorNotes] = useState<Record<string, string>>(() => {
    const savedNotes = localStorage.getItem('nexus_investor_notes');
    return savedNotes ? JSON.parse(savedNotes) : {};
  });

  // Notes ko automatic localStorage mein sync karne ke liye effect
  useEffect(() => {
    localStorage.setItem('nexus_investor_notes', JSON.stringify(investorNotes));
  }, [investorNotes]);

  const handleNoteChange = (investorId: string, noteText: string) => {
    setInvestorNotes(prev => ({
      ...prev,
      [investorId]: noteText
    }));
  };
  // Filter ke mutabiq data nikalne ka real-time function
  const filteredInvestors = investors.filter(inv => {
    const matchesInterest = selectedInterest === 'All' || inv.investmentInterests.some(interest => interest.toLowerCase() === selectedInterest.toLowerCase());
    const matchesStage = selectedStage === 'All' || inv.investmentStage.some(stage => stage.toLowerCase() === selectedStage.toLowerCase());
    return matchesInterest && matchesStage;
  }).slice(0, 3); // Sirf top 3 matching items dikhane ke liye
  const [availabilitySlots, setAvailabilitySlots] = useState<string[]>(() => {
    const savedSlots = localStorage.getItem('nexus_availability_slots');
    return savedSlots ? JSON.parse(savedSlots) : ['10:00 AM', '02:00 PM', '04:30 PM'];
  });

  const [newSlot, setNewSlot] = useState('');

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const savedMeetings = localStorage.getItem('nexus_meetings_data');
    return savedMeetings ? JSON.parse(savedMeetings) : [
      { id: '1', investorName: 'Michael Vance', date: '2026-06-15', time: '11:00 AM', status: 'pending' },
      { id: '2', investorName: 'Alex Bernstein', date: '2026-06-18', time: '03:00 PM', status: 'confirmed' },
    ];
  });

  const [newMeetingName, setNewMeetingName] = useState('');
  const [newMeetingDate, setNewMeetingDate] = useState('');
  const [newMeetingTime, setNewMeetingTime] = useState('');
  const [cancellingMeetingId, setCancellingMeetingId] = useState<string | null>(null);

  const meetingToCancel = meetings.find((meeting) => meeting.id === cancellingMeetingId) || null;

  // --- 2. PITCH DECK STATE ---
  const [pitchDeck, setPitchDeck] = useState<{ name: string; size: string; uploadedAt: string } | null>(() => {
    const savedDeck = localStorage.getItem('nexus_pitch_deck');
    return savedDeck ? JSON.parse(savedDeck) : null;
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- 3. DATA PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('nexus_availability_slots', JSON.stringify(availabilitySlots));
  }, [availabilitySlots]);

  useEffect(() => {
    localStorage.setItem('nexus_meetings_data', JSON.stringify(meetings));
  }, [meetings]);

  // --- 4. ORIGINAL HANDLERS ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const newDeck = {
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            uploadedAt: new Date().toLocaleDateString(),
          };
          setPitchDeck(newDeck);
          localStorage.setItem('nexus_pitch_deck', JSON.stringify(newDeck));
          setUploading(false);
          toast.success('Pitch Deck uploaded successfully!');
          return 0;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleDeleteDeck = () => {
    setPitchDeck(null);
    localStorage.removeItem('nexus_pitch_deck');
    toast.success('Pitch Deck removed.');
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSlot.trim() && !availabilitySlots.includes(newSlot)) {
      setAvailabilitySlots([...availabilitySlots, newSlot]);
      setNewSlot('');
    }
  };

  const handleRemoveSlot = (slotToRemove: string) => {
    setAvailabilitySlots(availabilitySlots.filter(slot => slot !== slotToRemove));
  };

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingName.trim() || !newMeetingDate || !newMeetingTime) {
      toast.error('Please provide investor name, date, and time for the meeting.');
      return;
    }

    setMeetings(prev => [
      ...prev,
      {
        id: String(Date.now()),
        investorName: newMeetingName.trim(),
        date: newMeetingDate,
        time: newMeetingTime,
        status: 'pending',
      },
    ]);

    setNewMeetingName('');
    setNewMeetingDate('');
    setNewMeetingTime('');
    toast.success('Meeting scheduled and added to upcoming reminders.');
  };

  const handleMeetingAction = (meetingId: string, newStatus: Meeting['status']) => {
    setMeetings(prev => prev.map(meet => meet.id === meetingId ? { ...meet, status: newStatus } : meet));
  };

  const handleRequestCancel = (meetingId: string) => {
    setCancellingMeetingId(meetingId);
  };

  const handleConfirmCancel = () => {
    if (!cancellingMeetingId) return;
    handleMeetingAction(cancellingMeetingId, 'cancelled');
    setCancellingMeetingId(null);
    toast.success('Meeting canceled successfully.');
  };

  const handleCloseCancelModal = () => {
    setCancellingMeetingId(null);
  };

  const upcomingMeetings = meetings.filter(m => m.status === 'pending' || m.status === 'confirmed');
  const upcomingCount = upcomingMeetings.length;
  const meetingHistory = meetings.filter(m => m.status === 'done' || m.status === 'cancelled');

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-10 font-sans text-gray-900">
      
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600">Here's what's happening with your startup today</p>
        </div>
        <Link to="/investors">
          <Button className="flex items-center gap-2 bg-blue-600 text-white font-semibold">
             📈 Find Investors
          </Button>
        </Link>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border border-blue-100">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm text-blue-600 text-xl">🔔</div>
            <div><p className="text-xs font-bold text-blue-700 uppercase">Pending Requests</p><h3 className="text-xl font-bold">1</h3></div>
          </CardBody>
        </Card>
        <Card className="bg-emerald-50 border border-emerald-100">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm text-emerald-600 text-xl">👥</div>
            <div><p className="text-xs font-bold text-emerald-700 uppercase">Total Connections</p><h3 className="text-xl font-bold">1</h3></div>
          </CardBody>
        </Card>
        <Card className="bg-amber-50 border border-amber-100">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm text-amber-600 text-xl">📅</div>
            <div><p className="text-xs font-bold text-amber-700 uppercase">Upcoming Meetings</p><h3 className="text-xl font-bold">{upcomingCount}</h3></div>
          </CardBody>
        </Card>
        <Card className="bg-green-50 border border-green-100">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm text-green-600 text-xl">📊</div>
            <div><p className="text-xs font-bold text-green-700 uppercase">Profile Views</p><h3 className="text-xl font-bold">24</h3></div>
          </CardBody>
        </Card>
      </div>

      {/* Collaboration Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Collaboration Requests</h2>
              <Badge variant="primary">1 pending</Badge>
            </CardHeader>
            <CardBody>
              <div className="text-center py-4 text-gray-500 italic">Investor requests will appear here.</div>
            </CardBody>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <h2 className="text-base font-bold text-gray-900">Recommended Investors</h2>
              <Link to="/investors" className="text-xs font-bold text-blue-600 uppercase hover:underline">View All</Link>
            </CardHeader>
            
            <CardBody className="space-y-4">
              {/* Interactive Filters Dropdowns */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Investment interest</label>
                  <select 
                    value={selectedInterest} 
                    onChange={(e) => setSelectedInterest(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="All">All interests</option>
                    <option value="FinTech">FinTech</option>
                    <option value="CleanTech">CleanTech</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="AgTech">AgTech</option>
                    <option value="BioTech">BioTech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Funding Stage</label>
                  <select 
                    value={selectedStage} 
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="All">All Stages</option>
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Investors Target List */}
              {/* Dynamic Investors Target List with Quick Memo Logs */}
              <div className="space-y-4">
                {filteredInvestors.length > 0 ? (
                  filteredInvestors.map(inv => (
                    <div key={inv.id} className="p-3 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-2.5">
                      {/* Original Core Card Component */}
                      <InvestorCard investor={inv} showActions={false} />
                      
                      {/* Tiny Interactive Quick Log Input */}
                      <div className="pt-2 border-t border-dashed border-slate-100 flex gap-2 items-center">
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">Memo</span>
                        <input
                          type="text"
                          placeholder="Add private note for this investor..."
                          value={investorNotes[inv.id] || ''}
                          onChange={(e) => handleNoteChange(inv.id, e.target.value)}
                          className="w-full bg-slate-50 text-xs border border-transparent hover:border-slate-200 focus:bg-white focus:border-blue-400 p-1.5 rounded-lg text-slate-700 outline-none transition-all"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400 italic bg-slate-200/30 rounded-xl border border-dashed">
                    No matching investors found.
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Availability Slots & Meeting Scheduler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><h2 className="text-lg font-bold flex items-center gap-2">🕒 My Availability Slots</h2></CardHeader>
          <CardBody className="space-y-4">
            <form onSubmit={handleAddSlot} className="flex gap-2">
              <Input placeholder="e.g. 03:00 PM" value={newSlot} onChange={(e)=>setNewSlot(e.target.value)} />
              <Button type="submit" className="bg-blue-600 text-white font-semibold">Add</Button>
            </form>
            <div className="flex flex-wrap gap-2">
              {availabilitySlots.map(slot => (
                <span key={slot} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold flex items-center gap-2">
                  {slot} <button onClick={()=>handleRemoveSlot(slot)} className="text-gray-400 hover:text-red-500 font-bold">×</button>
                </span>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><h2 className="text-lg font-bold flex items-center gap-2">📅 Meeting Schedule Manager</h2></CardHeader>
          <CardBody className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Schedule a new meeting</h3>
                  <p className="text-sm text-slate-500">Add the investor name, date, and time to create a reminder.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-blue-700 shadow-sm">
                  <Video size={16} /> Meeting reminder
                </div>
              </div>

              <form onSubmit={handleAddMeeting} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Input
                  label="Investor name"
                  placeholder="e.g. Michael Vance"
                  value={newMeetingName}
                  onChange={(e) => setNewMeetingName(e.target.value)}
                  fullWidth
                />
                <Input
                  label="Meeting date"
                  type="date"
                  value={newMeetingDate}
                  onChange={(e) => setNewMeetingDate(e.target.value)}
                  fullWidth
                />
                <Input
                  label="Meeting time"
                  type="time"
                  value={newMeetingTime}
                  onChange={(e) => setNewMeetingTime(e.target.value)}
                  fullWidth
                />
                <Button type="submit" variant="primary" className="sm:col-span-2 lg:col-span-3 w-full">
                  Schedule meeting
                </Button>
              </form>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-amber-900">Upcoming meetings</p>
                  <p className="text-xs text-amber-800">Your scheduled reminders with action controls.</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{upcomingMeetings.length} active</span>
              </div>

              {upcomingMeetings.length ? upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <User2 size={16} /> {meeting.investorName}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                          <CalendarDays size={14} /> {new Date(meeting.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                          <Clock3 size={14} /> {meeting.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meeting.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {meeting.status === 'pending' ? 'Pending' : 'Confirmed'}
                      </span>
                      {meeting.status === 'pending' ? (
                        <>
                          <button onClick={() => handleMeetingAction(meeting.id, 'confirmed')} className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">Confirm</button>
                          <button onClick={() => handleRequestCancel(meeting.id)} className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleMeetingAction(meeting.id, 'done')} className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">Mark done</button>
                          <button onClick={() => handleRequestCancel(meeting.id)} className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">Cancel</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                  No upcoming meetings yet. Schedule one above to build a reminder list.
                </div>
              )}

              {meetingHistory.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Meeting history</p>
                      <p className="text-xs text-slate-500">Completed and canceled meetings.</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{meetingHistory.length} total</span>
                  </div>

                  <div className="space-y-3">
                    {meetingHistory.map((meeting) => (
                      <div key={meeting.id} className="rounded-3xl bg-white p-3 border border-slate-200">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-slate-900">{meeting.investorName}</div>
                          <span className={`text-xs font-semibold uppercase ${meeting.status === 'done' ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {meeting.status === 'done' ? 'Done' : 'Canceled'}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {new Date(meeting.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          <span className="inline-flex items-center gap-1"><Clock3 size={12} /> {meeting.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Pitch Deck Upload Section */}
      <Card className="border border-blue-100 bg-white">
        <CardHeader><h2 className="text-lg font-bold flex items-center gap-2">📄 Pitch Deck Documents</h2></CardHeader>
        <CardBody>
          {!pitchDeck && !uploading && (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50 hover:bg-white transition-all cursor-pointer relative">
              <input type="file" accept=".pdf,.pptx" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <p className="text-sm font-bold text-gray-700">Click to upload your Business Pitch Deck</p>
              <p className="text-xs text-gray-400">PDF or PPTX (Max 10MB)</p>
            </div>
          )}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold"><span className="text-gray-500">Uploading Document...</span><span className="text-blue-600">{uploadProgress}%</span></div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-blue-600 h-full transition-all" style={{width: `${uploadProgress}%`}}/></div>
            </div>
          )}
          {pitchDeck && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📑</span>
                <div><p className="text-sm font-bold text-gray-900">{pitchDeck.name}</p><p className="text-xs text-gray-500">{pitchDeck.size} • Uploaded on {pitchDeck.uploadedAt}</p></div>
              </div>
              <Button variant="outline" size="sm" onClick={handleDeleteDeck} className="text-red-600 border-red-200 hover:bg-red-50 font-semibold">Remove</Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* --- NEW PREMIUM VIDEO CALL MODULE --- */}
      <VideoCallMock />
<DashboardAnalytics />
      {cancellingMeetingId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 px-4 py-6 sm:items-center">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Confirm cancellation</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Cancel meeting reminder</h3>
              </div>
              <button type="button" onClick={handleCloseCancelModal} className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
                ✕
              </button>
            </div>

            <div className="mt-5 rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">{meetingToCancel?.investorName || 'Selected meeting'}</p>
              <p className="mt-2 text-slate-600">This action will cancel the scheduled meeting and move it to your history as canceled. You can still reschedule it later if needed.</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                {meetingToCancel && (
                  <>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
                      <CalendarDays size={14} /> {new Date(meetingToCancel.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
                      <Clock3 size={14} /> {meetingToCancel.time}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 justify-end">
              <button type="button" onClick={handleCloseCancelModal} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Keep meeting</button>
              <button type="button" onClick={handleConfirmCancel} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Yes, cancel meeting</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntrepreneurDashboard;