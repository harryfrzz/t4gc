/**
 * QR Code Scanner Component
 * Scans student QR codes for attendance marking
 */

"use client";

import { useState, useEffect } from 'react';
import { Camera, CameraOff, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { QRCodeData } from '@/types/attendance';
import { decodeQRData } from '@/lib/api/attendance';

interface QRScannerProps {
  sessionId: string;
  coachId: string;
  onAttendanceMarked?: (studentId: string, studentName: string) => void;
}

export function QRScanner({ sessionId, coachId, onAttendanceMarked }: QRScannerProps) {
  const { t } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedStudents, setScannedStudents] = useState<Set<string>>(new Set());
  const [Html5QrcodeScanner, setHtml5QrcodeScanner] = useState<any>(null);
  const [scanner, setScanner] = useState<any>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('html5-qrcode').then((module) => {
      setHtml5QrcodeScanner(() => module.Html5QrcodeScanner);
    });

    return () => {
      if (scanner) {
        scanner.clear().catch((err: any) => console.error('Error clearing scanner:', err));
      }
    };
  }, [scanner]);

  const startScanning = async () => {
    if (!Html5QrcodeScanner) {
      toast.error('QR scanner not loaded');
      return;
    }

    setIsScanning(true);

    const html5QrcodeScanner = new Html5QrcodeScanner(
      'qr-reader',
      { 
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanError);
    setScanner(html5QrcodeScanner);
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear().catch((err: any) => console.error('Error clearing scanner:', err));
      setScanner(null);
    }
    setIsScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    try {
      const qrData: QRCodeData | null = decodeQRData(decodedText);
      
      if (!qrData || !qrData.student_id) {
        toast.error('Invalid QR code');
        return;
      }

      // Check if already scanned
      if (scannedStudents.has(qrData.student_id)) {
        toast.info(`${qrData.name} already marked present`);
        return;
      }

      // Mark attendance
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: qrData.student_id,
          session_id: sessionId,
          status: 'present',
          marked_by: coachId,
          method: 'qr',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setScannedStudents((prev) => new Set(prev).add(qrData.student_id));
        toast.success(`✓ ${qrData.name} marked present`);
        onAttendanceMarked?.(qrData.student_id, qrData.name);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      toast.error('Failed to process QR code');
    }
  };

  const onScanError = (errorMessage: string) => {
    // Ignore common scanning errors to avoid spam
    if (!errorMessage.includes('NotFoundException')) {
      console.debug('QR scan error:', errorMessage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          {t('attendance.qrScanner', 'QR Code Scanner')}
        </CardTitle>
        <CardDescription>
          {t('attendance.scannerDescription', 'Scan student QR codes to mark attendance automatically')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isScanning ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="rounded-full bg-primary/10 p-6">
              <Camera className="h-12 w-12 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {t('attendance.readyToScan', 'Ready to scan student QR codes')}
            </p>
            <Button onClick={startScanning} size="lg">
              <Camera className="mr-2 h-4 w-4" />
              {t('attendance.startScanning', 'Start Scanning')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div id="qr-reader" className="w-full rounded-lg overflow-hidden" />
            <Button onClick={stopScanning} variant="destructive" className="w-full">
              <CameraOff className="mr-2 h-4 w-4" />
              {t('attendance.stopScanning', 'Stop Scanning')}
            </Button>
          </div>
        )}

        {scannedStudents.size > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              {t('attendance.scannedStudents', 'Scanned Students')} ({scannedStudents.size})
            </h4>
            <p className="text-xs text-muted-foreground">
              {t('attendance.scanComplete', 'Students have been marked present automatically')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
