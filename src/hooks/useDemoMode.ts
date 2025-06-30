import { useState } from 'react';

export const useDemoMode = () => {
  const [showDemoAlert, setShowDemoAlert] = useState(false);
  const [demoAlertConfig, setDemoAlertConfig] = useState({
    title: '',
    message: ''
  });

  const triggerDemoAlert = (title: string, message: string) => {
    setDemoAlertConfig({ title, message });
    setShowDemoAlert(true);
  };

  const closeDemoAlert = () => {
    setShowDemoAlert(false);
  };

  return {
    showDemoAlert,
    demoAlertConfig,
    triggerDemoAlert,
    closeDemoAlert
  };
};