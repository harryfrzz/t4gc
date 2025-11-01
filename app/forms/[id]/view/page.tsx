'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getForm, submitResponses } from '@/lib/api/forms';
import { Form, Question, Response } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';

export default function FormViewPage() {
  const params = useParams();
  const router = useRouter();
  const formId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});

  useEffect(() => {
    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const response = await getForm(formId);
      setForm(response.data);
    } catch (error) {
      console.error('Error loading form:', error);
      alert('Failed to load form');
      router.push('/forms');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleCheckboxChange = (questionId: number, option: string, checked: boolean) => {
    const current = answers[questionId] || [];
    if (checked) {
      setAnswers({ ...answers, [questionId]: [...current, option] });
    } else {
      setAnswers({ ...answers, [questionId]: current.filter((item: string) => item !== option) });
    }
  };

  const validateForm = () => {
    if (!form) return false;

    for (const question of form.userQuestions) {
      if (question.required) {
        const answer = answers[question.id];
        if (!answer || (Array.isArray(answer) && answer.length === 0) || answer === '') {
          alert(`Please answer: ${question.questionText}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const responses: Partial<Response>[] = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: parseInt(questionId),
        responseText: Array.isArray(answer) ? answer.join(', ') : String(answer),
        submittedAt: new Date().toISOString(),
      }));

      await submitResponses(formId, responses);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    switch (question.questionType) {
      case 'SHORT_ANSWER':
        return (
          <Input
            placeholder="Your answer"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            required={question.required}
          />
        );

      case 'PARAGRAPH':
        return (
          <Textarea
            placeholder="Your answer"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            required={question.required}
            rows={4}
          />
        );

      case 'MULTIPLE_CHOICE':
        return (
          <RadioGroup
            value={answers[question.id]}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            required={question.required}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'CHECKBOXES':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={(answers[question.id] || []).includes(option)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(question.id, option, checked as boolean)
                  }
                />
                <Label htmlFor={`${question.id}-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'DROPDOWN':
        return (
          <Select
            value={answers[question.id]}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            required={question.required}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading form...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!form) return null;

  if (submitted) {
    return (
      <div className="container mx-auto py-12 max-w-2xl">
        <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Response Submitted!</h2>
            <p className="text-muted-foreground mb-6 text-center">
              Thank you for completing "{form.formName}"
            </p>
            <Button onClick={() => router.push('/forms')}>Back to Forms</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">{form.formName}</CardTitle>
          {form.formDescription && (
            <CardDescription className="text-base">{form.formDescription}</CardDescription>
          )}
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.userQuestions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {index + 1}. {question.questionText}
                {question.required && <span className="text-destructive ml-1">*</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>{renderQuestion(question)}</CardContent>
          </Card>
        ))}

        <Button type="submit" size="lg" disabled={submitting} className="w-full">
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit Form
            </>
          )}
        </Button>
      </form>
    </div>
  );
}