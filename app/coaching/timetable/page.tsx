'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ArrowLeft, Clock, MapPin, User, Plus, Edit, Trash2, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

// Type definitions
interface ClassItem {
  time: string;
  subject: string;
  instructor: string;
  room: string;
  duration: number;
}

interface TimetableData {
  [key: string]: ClassItem[];
  Monday: ClassItem[];
  Tuesday: ClassItem[];
  Wednesday: ClassItem[];
  Thursday: ClassItem[];
  Friday: ClassItem[];
}

export default function TimetablePage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  
  // State management
  const [selectedClass, setSelectedClass] = useState('10th Standard');
  const [addClassDialogOpen, setAddClassDialogOpen] = useState(false);
  const [addSlotDialogOpen, setAddSlotDialogOpen] = useState(false);
  const [editSlotDialogOpen, setEditSlotDialogOpen] = useState(false);
  const [assignClassDialogOpen, setAssignClassDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  
  // Form state for adding/editing slots
  const [slotForm, setSlotForm] = useState({
    subject: '',
    instructor: '',
    room: '',
    duration: '1'
  });

  // Classes data
  const [classes, setClasses] = useState([
    '10th Standard',
    '11th Standard - Science',
    '11th Standard - Commerce',
    '12th Standard - Science',
    '12th Standard - Commerce'
  ]);

  // Admin class assignments - mapping admin to their assigned class
  const [adminAssignments, setAdminAssignments] = useState<{ [key: string]: string }>({
    // This would come from backend/database in real implementation
    // For now, using user email/id as key
  });

  // Get admin's assigned class
  const getAdminAssignedClass = () => {
    if (isAdmin && user) {
      return adminAssignments[user.email || user.id || ''] || null;
    }
    return null;
  };

  const adminAssignedClass = getAdminAssignedClass();
  
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];
  
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Timetable data by class
  const [timetablesByClass, setTimetablesByClass] = useState<{ [key: string]: TimetableData }>({
    '10th Standard': {
      Monday: [
        { time: '9:00 AM', subject: 'Mathematics', instructor: 'Dr. Sarah Johnson', room: 'Room 101', duration: 1.5 },
        { time: '11:00 AM', subject: 'Physics', instructor: 'Prof. Michael Chen', room: 'Lab 203', duration: 2 },
        { time: '2:00 PM', subject: 'Computer Science', instructor: 'Dr. Emily Rodriguez', room: 'Computer Lab', duration: 1.5 }
      ],
      Tuesday: [
        { time: '8:00 AM', subject: 'Chemistry', instructor: 'Dr. Robert Lee', room: 'Lab 105', duration: 2 },
        { time: '10:00 AM', subject: 'English Literature', instructor: 'Prof. Amanda White', room: 'Room 302', duration: 1 },
        { time: '1:00 PM', subject: 'History', instructor: 'Dr. James Miller', room: 'Room 201', duration: 1.5 }
      ],
      Wednesday: [
        { time: '9:00 AM', subject: 'Mathematics', instructor: 'Dr. Sarah Johnson', room: 'Room 101', duration: 1.5 },
        { time: '12:00 PM', subject: 'Biology', instructor: 'Prof. Lisa Anderson', room: 'Lab 304', duration: 2 },
        { time: '3:00 PM', subject: 'Physical Education', instructor: 'Coach David Brown', room: 'Sports Complex', duration: 1.5 }
      ],
      Thursday: [
        { time: '8:00 AM', subject: 'Computer Science', instructor: 'Dr. Emily Rodriguez', room: 'Computer Lab', duration: 2 },
        { time: '11:00 AM', subject: 'Physics', instructor: 'Prof. Michael Chen', room: 'Lab 203', duration: 1.5 },
        { time: '2:00 PM', subject: 'Art & Design', instructor: 'Ms. Rachel Green', room: 'Art Studio', duration: 2 }
      ],
      Friday: [
        { time: '9:00 AM', subject: 'Chemistry', instructor: 'Dr. Robert Lee', room: 'Lab 105', duration: 1.5 },
        { time: '11:00 AM', subject: 'Mathematics', instructor: 'Dr. Sarah Johnson', room: 'Room 101', duration: 1.5 },
        { time: '1:00 PM', subject: 'English Literature', instructor: 'Prof. Amanda White', room: 'Room 302', duration: 1.5 }
      ]
    },
    '11th Standard - Science': {
      Monday: [
        { time: '8:00 AM', subject: 'Physics', instructor: 'Prof. Michael Chen', room: 'Lab 201', duration: 2 },
        { time: '10:00 AM', subject: 'Chemistry', instructor: 'Dr. Robert Lee', room: 'Lab 105', duration: 2 },
        { time: '1:00 PM', subject: 'Mathematics', instructor: 'Dr. Sarah Johnson', room: 'Room 101', duration: 1.5 }
      ],
      Tuesday: [
        { time: '9:00 AM', subject: 'Biology', instructor: 'Prof. Lisa Anderson', room: 'Lab 304', duration: 2 },
        { time: '11:00 AM', subject: 'English', instructor: 'Prof. Amanda White', room: 'Room 302', duration: 1.5 }
      ],
      Wednesday: [
        { time: '8:00 AM', subject: 'Mathematics', instructor: 'Dr. Sarah Johnson', room: 'Room 101', duration: 2 },
        { time: '10:00 AM', subject: 'Physics', instructor: 'Prof. Michael Chen', room: 'Lab 201', duration: 2 }
      ],
      Thursday: [
        { time: '9:00 AM', subject: 'Chemistry', instructor: 'Dr. Robert Lee', room: 'Lab 105', duration: 2 },
        { time: '11:00 AM', subject: 'Computer Science', instructor: 'Dr. Emily Rodriguez', room: 'Computer Lab', duration: 1.5 }
      ],
      Friday: [
        { time: '8:00 AM', subject: 'Biology', instructor: 'Prof. Lisa Anderson', room: 'Lab 304', duration: 2 },
        { time: '10:00 AM', subject: 'Mathematics', instructor: 'Dr. Sarah Johnson', room: 'Room 101', duration: 2 }
      ]
    },
    '11th Standard - Commerce': {
      Monday: [
        { time: '9:00 AM', subject: 'Accountancy', instructor: 'Prof. John Davis', room: 'Room 401', duration: 1.5 },
        { time: '11:00 AM', subject: 'Business Studies', instructor: 'Ms. Patricia Wilson', room: 'Room 402', duration: 2 }
      ],
      Tuesday: [
        { time: '8:00 AM', subject: 'Economics', instructor: 'Dr. Mark Thompson', room: 'Room 403', duration: 2 },
        { time: '10:00 AM', subject: 'English', instructor: 'Prof. Amanda White', room: 'Room 302', duration: 1.5 }
      ],
      Wednesday: [
        { time: '9:00 AM', subject: 'Mathematics', instructor: 'Dr. Sarah Johnson', room: 'Room 101', duration: 1.5 },
        { time: '11:00 AM', subject: 'Accountancy', instructor: 'Prof. John Davis', room: 'Room 401', duration: 2 }
      ],
      Thursday: [
        { time: '8:00 AM', subject: 'Business Studies', instructor: 'Ms. Patricia Wilson', room: 'Room 402', duration: 2 },
        { time: '10:00 AM', subject: 'Economics', instructor: 'Dr. Mark Thompson', room: 'Room 403', duration: 1.5 }
      ],
      Friday: [
        { time: '9:00 AM', subject: 'Computer Applications', instructor: 'Dr. Emily Rodriguez', room: 'Computer Lab', duration: 2 },
        { time: '11:00 AM', subject: 'Accountancy', instructor: 'Prof. John Davis', room: 'Room 401', duration: 1.5 }
      ]
    },
    '12th Standard - Science': {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: []
    },
    '12th Standard - Commerce': {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: []
    }
  });

  const timetableData: TimetableData = timetablesByClass[selectedClass] || {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: []
  };

  const subjectColors: { [key: string]: string } = {
    'Mathematics': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300',
    'Physics': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300',
    'Computer Science': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300',
    'Chemistry': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300',
    'English Literature': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-300',
    'English': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-300',
    'History': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300',
    'Biology': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 border-teal-300',
    'Physical Education': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-300',
    'Art & Design': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-300',
    'Accountancy': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-300',
    'Business Studies': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-300',
    'Economics': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300',
    'Computer Applications': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300'
  };

  // Handlers
  const handleAddClass = () => {
    if (newClassName.trim()) {
      setClasses([...classes, newClassName]);
      setTimetablesByClass({
        ...timetablesByClass,
        [newClassName]: {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: []
        }
      });
      setNewClassName('');
      setAddClassDialogOpen(false);
    }
  };

  const handleDeleteClass = (className: string) => {
    if (confirm(`Are you sure you want to delete ${className}?`)) {
      setClasses(classes.filter(c => c !== className));
      const newTimetables = { ...timetablesByClass };
      delete newTimetables[className];
      setTimetablesByClass(newTimetables);
      if (selectedClass === className && classes.length > 1) {
        setSelectedClass(classes.filter(c => c !== className)[0]);
      }
    }
  };

  const handleAddSlot = () => {
    if (!selectedSlot || !slotForm.subject || !slotForm.instructor || !slotForm.room) {
      alert('Please fill all fields');
      return;
    }

    const newSlot = {
      time: selectedSlot.time,
      subject: slotForm.subject,
      instructor: slotForm.instructor,
      room: slotForm.room,
      duration: parseFloat(slotForm.duration)
    };

    setTimetablesByClass({
      ...timetablesByClass,
      [selectedClass]: {
        ...timetablesByClass[selectedClass],
        [selectedSlot.day]: [
          ...(timetablesByClass[selectedClass][selectedSlot.day] || []),
          newSlot
        ]
      }
    });

    setSlotForm({ subject: '', instructor: '', room: '', duration: '1' });
    setSelectedSlot(null);
    setAddSlotDialogOpen(false);
  };

  const handleEditSlot = () => {
    if (!editingClass || !selectedSlot || !slotForm.subject || !slotForm.instructor || !slotForm.room) {
      alert('Please fill all fields');
      return;
    }

    const dayClasses = timetablesByClass[selectedClass][selectedSlot.day] || [];
    const updatedClasses = dayClasses.map((cls: any) => 
      cls.time === editingClass.time && cls.subject === editingClass.subject
        ? {
            ...cls,
            subject: slotForm.subject,
            instructor: slotForm.instructor,
            room: slotForm.room,
            duration: parseFloat(slotForm.duration)
          }
        : cls
    );

    setTimetablesByClass({
      ...timetablesByClass,
      [selectedClass]: {
        ...timetablesByClass[selectedClass],
        [selectedSlot.day]: updatedClasses
      }
    });

    setSlotForm({ subject: '', instructor: '', room: '', duration: '1' });
    setEditingClass(null);
    setSelectedSlot(null);
    setEditSlotDialogOpen(false);
  };

  const handleDeleteSlot = (day: string, classItem: any) => {
    if (confirm(`Are you sure you want to delete ${classItem.subject}?`)) {
      const dayClasses = timetablesByClass[selectedClass][day] || [];
      const updatedClasses = dayClasses.filter((cls: any) => 
        !(cls.time === classItem.time && cls.subject === classItem.subject)
      );

      setTimetablesByClass({
        ...timetablesByClass,
        [selectedClass]: {
          ...timetablesByClass[selectedClass],
          [day]: updatedClasses
        }
      });
    }
  };

  const openAddSlotDialog = (day: string, time: string) => {
    setSelectedSlot({ day, time });
    setSlotForm({ subject: '', instructor: '', room: '', duration: '1' });
    setAddSlotDialogOpen(true);
  };

  const openEditSlotDialog = (day: string, classItem: any) => {
    setSelectedSlot({ day, time: classItem.time });
    setEditingClass(classItem);
    setSlotForm({
      subject: classItem.subject,
      instructor: classItem.instructor,
      room: classItem.room,
      duration: classItem.duration.toString()
    });
    setEditSlotDialogOpen(true);
  };

  const handleAssignClass = (className: string) => {
    if (user) {
      setAdminAssignments({
        ...adminAssignments,
        [user.email || user.id || '']: className
      });
      setSelectedClass(className);
      setAssignClassDialogOpen(false);
    }
  };

  const handleUnassignClass = () => {
    if (user && confirm('Are you sure you want to unassign from this class?')) {
      const newAssignments = { ...adminAssignments };
      delete newAssignments[user.email || user.id || ''];
      setAdminAssignments(newAssignments);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Class Timetable</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {isAdmin 
              ? (adminAssignedClass 
                  ? `Managing timetable for ${adminAssignedClass}` 
                  : 'Assign yourself to a class to manage its timetable')
              : 'Weekly schedule for all classes'}
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && !adminAssignedClass && (
            <Button onClick={() => setAssignClassDialogOpen(true)}>
              <GraduationCap className="h-4 w-4 mr-2" />
              Assign to Class
            </Button>
          )}
          {isAdmin && adminAssignedClass && (
            <>
              <Button variant="outline" onClick={handleUnassignClass}>
                Change Class
              </Button>
              <Button onClick={() => setAddClassDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
            </>
          )}
          <Button variant="outline">Download PDF</Button>
        </div>
      </div>

      {/* Admin Assignment Warning */}
      {isAdmin && !adminAssignedClass && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <GraduationCap className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                  No Class Assigned
                </h3>
                <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                  You need to assign yourself to a class to view and manage its timetable. Click the "Assign to Class" button to get started.
                </p>
                <Button 
                  size="sm" 
                  onClick={() => setAssignClassDialogOpen(true)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <GraduationCap className="h-3 w-3 mr-2" />
                  Assign to Class Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Assignment Info */}
      {isAdmin && adminAssignedClass && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    Currently Managing
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {adminAssignedClass}
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setAssignClassDialogOpen(true)}
              >
                <Edit className="h-3 w-3 mr-2" />
                Change Class
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Class Selection - Admin View - Only show if assigned to a class */}
      {isAdmin && adminAssignedClass && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Classes</CardTitle>
            <CardDescription>Select a class to view and edit its timetable</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {classes.map((className) => (
                <div key={className} className="relative group">
                  <Button
                    variant={selectedClass === className ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSelectedClass(className)}
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    {className}
                  </Button>
                  <button
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white p-1 rounded-full shadow-lg hover:bg-red-700"
                    onClick={() => handleDeleteClass(className)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timetable Grid - Only show if admin is assigned to a class */}
      {(!isAdmin || (isAdmin && adminAssignedClass)) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Weekly Schedule - {selectedClass}</CardTitle>
                <CardDescription className="mt-1">
                  {isAdmin ? 'Click on empty slots to add classes or click on existing classes to edit' : 'View your weekly schedule'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid grid-cols-6 gap-2 mb-2">
                <div className="font-semibold text-sm text-center p-2">Time</div>
                {weekDays.map((day) => (
                  <div key={day} className="font-semibold text-sm text-center p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-6 gap-2 mb-2">
                  <div className="text-sm text-muted-foreground text-center p-2 font-medium">
                    {time}
                  </div>
                  {weekDays.map((day) => {
                    const classItem = timetableData[day as keyof typeof timetableData]?.find(
                      (item) => item.time === time
                    );

                    return (
                      <div key={`${day}-${time}`} className="min-h-[60px]">
                        {classItem ? (
                          <div
                            className={cn(
                              'p-3 rounded-lg border-l-4 h-full group relative',
                              subjectColors[classItem.subject] || 'bg-gray-100 text-gray-800 border-gray-300'
                            )}
                          >
                            <p className="font-semibold text-xs mb-1">{classItem.subject}</p>
                            <p className="text-xs flex items-center gap-1 mb-1">
                              <User className="h-3 w-3" />
                              {classItem.instructor}
                            </p>
                            <p className="text-xs flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {classItem.room}
                            </p>
                            {isAdmin && (
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button
                                  className="bg-white dark:bg-neutral-800 p-1 rounded shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900"
                                  onClick={() => openEditSlotDialog(day, classItem)}
                                >
                                  <Edit className="h-3 w-3 text-blue-600" />
                                </button>
                                <button
                                  className="bg-white dark:bg-neutral-800 p-1 rounded shadow-sm hover:bg-red-50 dark:hover:bg-red-900"
                                  onClick={() => handleDeleteSlot(day, classItem)}
                                >
                                  <Trash2 className="h-3 w-3 text-red-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          isAdmin && (
                            <button
                              className="w-full h-full min-h-[60px] border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center"
                              onClick={() => openAddSlotDialog(day, time)}
                            >
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Legend - Only show if admin is assigned to a class */}
      {(!isAdmin || (isAdmin && adminAssignedClass)) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subject Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(subjectColors).map(([subject, colorClass]) => (
                <div key={subject} className="flex items-center gap-2">
                  <div className={cn('w-4 h-4 rounded border-l-4', colorClass)} />
                  <span className="text-sm">{subject}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Classes - Only show if admin is assigned to a class */}
      {(!isAdmin || (isAdmin && adminAssignedClass)) && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule - {selectedClass}</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-3">
            {timetableData.Monday && timetableData.Monday.length > 0 ? (
              timetableData.Monday.map((classItem, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-4 rounded-lg border-l-4',
                    subjectColors[classItem.subject]
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{classItem.subject}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {classItem.time} ({classItem.duration}h)
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {classItem.instructor}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {classItem.room}
                        </span>
                      </div>
                    </div>
                    {!isAdmin && (
                      <Button size="sm" variant="outline">
                        Join Class
                      </Button>
                    )}
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditSlotDialog('Monday', classItem)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteSlot('Monday', classItem)}>
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No classes scheduled for today
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      )}

      {/* Assign Class Dialog */}
      <Dialog open={assignClassDialogOpen} onOpenChange={setAssignClassDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign to Class</DialogTitle>
            <DialogDescription>
              Select a class to manage its timetable. You can change this assignment later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Choose which class you want to work with:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {classes.map((className) => (
                <Button
                  key={className}
                  variant={adminAssignedClass === className ? 'default' : 'outline'}
                  className="w-full justify-start h-auto py-3"
                  onClick={() => handleAssignClass(className)}
                >
                  <GraduationCap className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">{className}</div>
                    {adminAssignedClass === className && (
                      <div className="text-xs opacity-80">Currently assigned</div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignClassDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Class Dialog */}
      <Dialog open={addClassDialogOpen} onOpenChange={setAddClassDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>
              Create a new class/standard to manage its timetable
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="className">Class Name *</Label>
              <Input
                id="className"
                placeholder="e.g., 12th Standard - Arts"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddClassDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddClass}>Add Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Slot Dialog */}
      <Dialog open={addSlotDialogOpen} onOpenChange={setAddSlotDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Class Slot</DialogTitle>
            <DialogDescription>
              Add a new class to {selectedSlot?.day} at {selectedSlot?.time}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics"
                value={slotForm.subject}
                onChange={(e) => setSlotForm({ ...slotForm, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor *</Label>
              <Input
                id="instructor"
                placeholder="e.g., Dr. Sarah Johnson"
                value={slotForm.instructor}
                onChange={(e) => setSlotForm({ ...slotForm, instructor: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room *</Label>
              <Input
                id="room"
                placeholder="e.g., Room 101"
                value={slotForm.room}
                onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours) *</Label>
              <Select
                value={slotForm.duration}
                onValueChange={(value) => setSlotForm({ ...slotForm, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5 hours</SelectItem>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="1.5">1.5 hours</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="2.5">2.5 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSlotDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSlot}>Add Slot</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Slot Dialog */}
      <Dialog open={editSlotDialogOpen} onOpenChange={setEditSlotDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Class Slot</DialogTitle>
            <DialogDescription>
              Modify class details for {selectedSlot?.day} at {selectedSlot?.time}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-subject">Subject *</Label>
              <Input
                id="edit-subject"
                placeholder="e.g., Mathematics"
                value={slotForm.subject}
                onChange={(e) => setSlotForm({ ...slotForm, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-instructor">Instructor *</Label>
              <Input
                id="edit-instructor"
                placeholder="e.g., Dr. Sarah Johnson"
                value={slotForm.instructor}
                onChange={(e) => setSlotForm({ ...slotForm, instructor: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-room">Room *</Label>
              <Input
                id="edit-room"
                placeholder="e.g., Room 101"
                value={slotForm.room}
                onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duration (hours) *</Label>
              <Select
                value={slotForm.duration}
                onValueChange={(value) => setSlotForm({ ...slotForm, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5 hours</SelectItem>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="1.5">1.5 hours</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="2.5">2.5 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSlotDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSlot}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
