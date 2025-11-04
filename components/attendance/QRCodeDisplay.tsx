/**
 * QR Code Display Component
 * Displays student's QR code with download functionality
 */

"use client";

import { useState, useEffect } from 'react';
import { Download, QrCode as QrCodeIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface QRCodeDisplayProps {
  studentId: string;
  studentName: string;
}

export function QRCodeDisplay({ studentId, studentName }: QRCodeDisplayProps) {
  const { t } = useTranslation();
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [QRCodeSVG, setQRCodeSVG] = useState<any>(null);

  useEffect(() => {
    // Dynamic import of react-qr-code to avoid SSR issues
    import('react-qr-code').then((module) => {
      setQRCodeSVG(() => module.default);
    });
  }, []);

  useEffect(() => {
    async function fetchOrGenerateQR() {
      try {
        // Try to fetch existing QR code
        const response = await fetch(`/api/student/qr?student_id=${studentId}`);
        
        if (response.ok) {
          const data = await response.json();
          setQrCodeData(data.data.qr_code);
        } else {
          // Generate new QR code
          const generateResponse = await fetch('/api/student/qr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id: studentId }),
          });

          if (generateResponse.ok) {
            const data = await generateResponse.json();
            setQrCodeData(data.data.qr_code);
          } else {
            toast.error('Failed to generate QR code');
          }
        }
      } catch (error) {
        console.error('Error with QR code:', error);
        toast.error('Failed to load QR code');
      } finally {
        setLoading(false);
      }
    }

    fetchOrGenerateQR();
  }, [studentId]);

  const downloadQRCode = () => {
    const svg = document.getElementById('student-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `${studentName.replace(/\s+/g, '_')}_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      toast.success('QR code downloaded successfully');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCodeIcon className="h-5 w-5" />
            {t('attendance.myQRCode', 'My QR Code')}
          </CardTitle>
          <CardDescription>
            {t('attendance.qrCodeLoading', 'Loading your QR code...')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-pulse bg-muted rounded-lg" style={{ width: 256, height: 256 }} />
        </CardContent>
      </Card>
    );
  }

  if (!qrCodeData || !QRCodeSVG) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCodeIcon className="h-5 w-5" />
            {t('attendance.myQRCode', 'My QR Code')}
          </CardTitle>
          <CardDescription className="text-destructive">
            {t('attendance.qrCodeError', 'Failed to load QR code')}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCodeIcon className="h-5 w-5" />
          {t('attendance.myQRCode', 'My QR Code')}
        </CardTitle>
        <CardDescription>
          {t('attendance.qrCodeDescription', 'Show this code to your coach for quick attendance marking')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center p-4 bg-white rounded-lg">
          <QRCodeSVG
            id="student-qr-code"
            value={qrCodeData}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium mb-2">{studentName}</p>
          <p className="text-xs text-muted-foreground">{studentId}</p>
        </div>
        <Button
          onClick={downloadQRCode}
          className="w-full"
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          {t('attendance.downloadQR', 'Download QR Code')}
        </Button>
      </CardContent>
    </Card>
  );
}
