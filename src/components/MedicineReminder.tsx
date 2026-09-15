import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Plus, Trash2, Clock, Pill } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import SEO from './SEO';
import { useLanguage } from '@/contexts/LanguageContext';

interface Reminder {
  id: number;
  medicine: string;
  dosage: string;
  time: string;
  enabled: boolean;
}

// Mock data for medicine reminders
const initialReminders: Reminder[] = [
  {
    id: 1,
    medicine: "Lisinopril",
    dosage: "10mg",
    time: "08:00",
    enabled: true
  },
  {
    id: 2,
    medicine: "Metformin",
    dosage: "500mg",
    time: "12:00",
    enabled: true
  },
  {
    id: 3,
    medicine: "Loratadine",
    dosage: "10mg",
    time: "20:00",
    enabled: false
  }
];

const MedicineReminder = () => {
  const { t } = useLanguage();
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [newReminder, setNewReminder] = useState({
    medicine: "",
    dosage: "",
    time: ""
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { toast } = useToast();

  // Check for reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      if (!notificationsEnabled) return;
      
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      reminders.forEach(reminder => {
        if (reminder.enabled && reminder.time === currentTime) {
          // Show notification
          toast({
            title: t('medicine_reminders'),
            description: `${t('time_to_take')} ${reminder.medicine} (${reminder.dosage})`,
            variant: "default"
          });
          
          // In a real app, this would trigger a browser notification
          if (Notification.permission === "granted") {
            new Notification(t('medicine_reminders'), {
              body: `${t('time_to_take')} ${reminder.medicine} (${reminder.dosage})`,
              icon: "/favicon.ico"
            });
          }
          
          // In a real implementation, this would also send an email/SMS notification
          // sendMedicineReminderNotification(reminder);
        }
      });
    };
    
    // Request notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    
    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders, notificationsEnabled, toast, t]);

  const handleAddReminder = () => {
    if (!newReminder.medicine || !newReminder.dosage || !newReminder.time) {
      toast({
        title: t('error_occurred'),
        description: t('fill_all_fields'),
        variant: "destructive"
      });
      return;
    }
    
    const reminder = {
      id: reminders.length + 1,
      medicine: newReminder.medicine,
      dosage: newReminder.dosage,
      time: newReminder.time,
      enabled: true
    };
    
    setReminders([...reminders, reminder]);
    setNewReminder({ medicine: "", dosage: "", time: "" });
    
    toast({
      title: t('reminder_added'),
      description: `${t('medicine_reminder_for')} ${reminder.medicine} ${t('added_successfully')}`
    });
  };

  const handleDeleteReminder = (id: number) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    
    toast({
      title: t('reminder_removed'),
      description: t('medicine_reminder_deleted')
    });
  };

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
  };

  return (
    <div className="py-8">
      <SEO 
        title={`${t('medicine_reminders')} - ${t('never_miss_dose')} | Mr.Doc`}
        description={t('medicine_reminder_description')}
        keywords={["medicine reminders", "medication schedule", "pill reminder", "medication alerts", "health tracking"]}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            {t('medicine_reminders')}
          </CardTitle>
          <CardDescription>
            {t('medicine_reminder_subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-gray-600" />
              <Label htmlFor="notifications" className="font-medium">
                {t('enable_notifications')}
              </Label>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
          
          {/* Add New Reminder */}
          <div className="mb-8 p-4 border rounded-lg">
            <h3 className="font-medium mb-4 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              {t('add_new_reminder')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="medicine" className="text-sm">{t('medicine')}</Label>
                <Input
                  id="medicine"
                  placeholder={t('e_g_lisinopril')}
                  value={newReminder.medicine}
                  onChange={(e) => setNewReminder({...newReminder, medicine: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="dosage" className="text-sm">{t('dosage')}</Label>
                <Input
                  id="dosage"
                  placeholder={t('e_g_10mg')}
                  value={newReminder.dosage}
                  onChange={(e) => setNewReminder({...newReminder, dosage: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-sm">{t('time')}</Label>
                <Input
                  id="time"
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddReminder} className="w-full">
                  {t('add_reminder')}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Current Reminders */}
          <div>
            <h3 className="font-medium mb-4 flex items-center">
              <Pill className="h-4 w-4 mr-2" />
              {t('current_reminders')}
            </h3>
            
            {reminders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BellOff className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>{t('no_reminders_yet')}</p>
                <p className="text-sm mt-2">{t('add_first_reminder')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div 
                    key={reminder.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      reminder.enabled ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="mr-4">
                        <div className="bg-health-primary text-white p-2 rounded-full">
                          <Pill className="h-5 w-5" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">{reminder.medicine}</h4>
                        <p className="text-sm text-gray-600">{reminder.dosage} {t('at')} {reminder.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => toggleReminder(reminder.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReminder(reminder.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicineReminder;