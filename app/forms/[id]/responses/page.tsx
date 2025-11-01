'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getForm, getResponses } from '@/lib/api/forms';
import { Form, Response } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, FileText, Users, TrendingUp } from 'lucide-react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ResponsesPage() {
  const router = useRouter();
  const params = useParams();
  const formId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);

  useEffect(() => {
    loadData();
  }, [formId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [formResponse, responsesResponse] = await Promise.all([
        getForm(formId),
        getResponses(formId)
      ]);
      setForm(formResponse.data);
      setResponses(responsesResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load responses');
      router.push('/forms');
    } finally {
      setLoading(false);
    }
  };

  const getResponsesByQuestion = (questionId: number) => {
    return responses.filter(r => r.questionId === questionId);
  };

  const getUniqueResponseCount = () => {
    const uniqueSubmissions = new Set(responses.map(r => r.submittedAt));
    return uniqueSubmissions.size;
  };

  const getChartData = () => {
    const submissionDates: { [key: string]: number } = {};
    
    responses.forEach(r => {
      if (r.submittedAt) {
        const date = new Date(r.submittedAt).toLocaleDateString();
        submissionDates[date] = (submissionDates[date] || 0) + 1;
      }
    });

    return Object.entries(submissionDates)
      .map(([date, count]) => ({ date, responses: count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading responses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!form) return null;

  const chartData = getChartData();

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push('/forms')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forms
        </Button>
        <h1 className="text-4xl font-bold tracking-tight">{form.formName}</h1>
        <p className="text-muted-foreground mt-2">Form responses and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getUniqueResponseCount()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Questions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{form.userQuestions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Answers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responses.length}</div>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Responses Over Time</CardTitle>
            <CardDescription>Number of form responses received per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="responses" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {responses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No responses yet</h3>
            <p className="text-muted-foreground mb-6">Share your form to start collecting responses</p>
            <Button onClick={() => router.push(`/forms/${formId}/view`)}>
              Preview Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {form.userQuestions.map((question, index) => {
            const questionResponses = getResponsesByQuestion(question.id);
            
            return (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {index + 1}. {question.questionText}
                  </CardTitle>
                  <CardDescription>
                    {questionResponses.length} response{questionResponses.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {questionResponses.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No responses yet</p>
                    ) : (
                      questionResponses.map((response, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-lg bg-muted/50 border"
                        >
                          <p className="text-sm">{response.responseText}</p>
                          {response.submittedAt && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Submitted: {new Date(response.submittedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}