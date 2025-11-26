
import React, { useState, useEffect } from 'react';

interface Props {
  initialZip: string;
  onBack: () => void;
}

const TesterLocator: React.FC<Props> = ({ initialZip, onBack }) => {
  const [zipCode, setZipCode] = useState(initialZip);
  const [showRequestForm, setShowRequestForm] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formZip, setFormZip] = useState(initialZip);
  const [vehicleType, setVehicleType] = useState('Heavy Duty (OBD + Smoke)');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [agreeToApp, setAgreeToApp] = useState(true);

  useEffect(() => {
    setFormZip(initialZip);
    setZipCode(initialZip);
  }, [initialZip]);

  const constructMessage = () => {
    let msg = "TESTING REQUEST\n---------------\n";
    msg += `Name: ${name}\n`;
    msg += 