'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getForm, updateForm } from '@/lib/api/forms';
import { Form, Question, QuestionType } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const formId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [questions, setQuestions] = useState<Partial<Question>[]>([]);

  useEffect(() => {
    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const response = await getForm(formId);
      const form = response.data;
      setFormName(form.formName);
      setFormDescription(form.formDescription || '');
      setQuestions(form.userQuestions || []);
    } catch (error) {
      console.error('Error loading form:', error);
      alert('Failed to load form');
      router.push('/forms');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { 
      questionText: '', 
      questionType: 'SHORT_ANSWER', 
      required: false,
      options: []
    }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOptions = (index: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    const options = [...(updated[index].options || [])];
    options[optionIndex] = value;
    updated[index] = { ...updated[index], options };
    setQuestions(updated);
  };

  const addOption = (index: number) => {
    const updated = [...questions];
    updated[index] = { 
      ...updated[index], 
      options: [...(updated[index].options || []), ''] 
    };
    setQuestions(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    const options = (updated[questionIndex].options || []).filter((_, i) => i !== optionIndex);
    updated[questionIndex] = { ...updated[questionIndex], options };
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formName.trim()) {
      alert('Please enter a form name');
      return;
    }

    if (questions.length === 0 || !questions[0].questionText?.trim()) {
      alert('Please add at least one question');
      return;
    }

    setSaving(true);

    try {
      const formData: Partial<Form> = {
        formName: formName.trim(),
        formDescription: formDescription.trim(),
        userQuestions: questions.map((q, index) => ({
          ...q,
          id: q.id || index + 1,
          order: index + 1,
          questionText: q.questionText || '',
          questionType: q.questionType || 'SHORT_ANSWER',
          required: q.required || false
        })) as Question[]
      };

      await updateForm(formId, formData);
      router.push('/forms');
    } catch (error) {
      console.error('Error updating form:', error);
      alert('Failed to update form. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const needsOptions = (type: QuestionType | undefined) => {
    return type === 'MULTIPLE_CHOICE' || type === 'CHECKBOXES' || type === 'DROPDOWN';
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

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push('/forms')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forms
        </Button>
        <h1 className="text-4xl font-bold tracking-tight">Edit Form</h1>
        <p className="text-muted-foreground mt-2">Update your form details and questions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Form Details</CardTitle>
            <CardDescription>Basic information about your form</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="formName">Form Name *</Label>
              <Input
                id="formName"
                placeholder="Enter form name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="formDescription">Description</Label>
              <Textarea
                id="formDescription"
                placeholder="Enter form description (optional)"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {questions.map((question, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Question Text *</Label>
                <Input
                  placeholder="Enter your question"
                  value={question.questionText || ''}
                  onChange={(e) => updateQuestion(index, 'questionText', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={question.questionType}
                    onValueChange={(value) => updateQuestion(index, 'questionType', value as QuestionType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                      <SelectItem value="PARAGRAPH">Paragraph</SelectItem>
                      <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                      <SelectItem value="CHECKBOXES">Checkboxes</SelectItem>
                      <SelectItem value="DROPDOWN">Dropdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id={`required-${index}`}
                    checked={question.required}
                    onCheckedChange={(checked) => updateQuestion(index, 'required', checked)}
                  />
                  <Label htmlFor={`required-${index}`} className="cursor-pointer">
                    Required
                  </Label>
                </div>
              </div>

              {needsOptions(question.questionType) && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {(question.options || []).map((option, optionIndex) => (
                    <div key={optionIndex} className="flex gap-2">
                      <Input
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => updateOptions(index, optionIndex, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeOption(index, optionIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(index)}
                    className="w-full"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addQuestion}
          className="w-full"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Question
        </Button>

        <div className="flex gap-4">
          <Button type="submit" size="lg" disabled={saving} className="flex-1">
            <Save className="mr-2 h-5 w-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.push('/forms')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}