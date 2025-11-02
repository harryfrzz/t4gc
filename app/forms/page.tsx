'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllForms, deleteForm } from '@/lib/api/forms';
import { Form } from '@/types/forms';
// ... rest of your imports

export default function FormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ... rest of your state

  // Check if we're in offline mode
  const OFFLINE_MODE = !process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL === '';

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllForms();
      setForms(response.data);
    } catch (err) {
      setError('Failed to load forms. Please try again.');
      console.error('Error loading forms:', err);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your functions

  return (
    <>
      <div className="container mx-auto py-8">
        {/* Offline Mode Indicator */}
        {OFFLINE_MODE && (
          <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  🔌 Demo Mode Active
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Running with mock data. All changes are temporary and stored in memory. 
                  Add <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-800 rounded">NEXT_PUBLIC_API_URL</code> to your <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-800 rounded">.env.local</code> to connect to the backend.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          {/* ... rest of your code */}
        </div>

        {/* ... rest of your JSX */}
      </div>
    </>
  );
}
