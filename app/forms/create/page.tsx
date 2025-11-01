'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createForm } from '@/lib/api/forms';
import { Form, Question, QuestionType } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2, Save, ArrowLeft, GripVertical } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function CreateFormPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [questions, setQuestions] = useState<Partial<Question>[]>([
    { 
      questionText: '', 
      questionType: 'SHORT_ANSWER', 
      required: false,
      options: []
    }
  ]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addQuestion = () => {
    setQuestions([...questions, { 
      questionText: '', 
      questionType: 'SHORT_ANSWER', 
      required: false,
      options: []
    }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      alert('You must have at least one question');
      return;
    }
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

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const updated = [...questions];
    const [removed] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, removed);
    
    setQuestions(updated);
    setDraggedIndex(null);
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
      const formData = {
        formName: formName.trim(),
        formDescription: formDescription.trim(),
        userQuestions: questions.map((q, index) => ({
          questionText: q.questionText || '',
          questionType: q.questionType || 'SHORT_ANSWER',
          required: q.required || false,
          order: index + 1,
          options: q.options || []
        }))
      };

      await createForm(formData);
      router.push('/forms');
    } catch (error) {
      console.error('❌ Error creating form:', error);
      alert('Failed to create form. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const needsOptions = (type: QuestionType | undefined) => {
    return type === 'MULTIPLE_CHOICE' || type === 'CHECKBOXES' || type === 'DROPDOWN';
  };

  const renderPreview = (question: Partial<Question>) => {
    switch (question.questionType) {
      case 'SHORT_ANSWER':
        return <Input placeholder="Short answer text" disabled />;
      case 'PARAGRAPH':
        return <Textarea placeholder="Long answer text" rows={3} disabled />;
      case 'MULTIPLE_CHOICE':
      case 'CHECKBOXES':
      case 'DROPDOWN':
        return (
          <div className="space-y-2 text-sm text-muted-foreground">
            {(question.options || []).length > 0 ? (
              question.options?.map((opt, i) => (
                <div key={i}>• {opt || `Option ${i + 1}`}</div>
              ))
            ) : (
              <div className="italic">No options added yet</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push('/forms')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forms
        </Button>
        <h1 className="text-4xl font-bold tracking-tight">Create New Form</h1>
        <p className="text-muted-foreground mt-2">Build your custom form with questions</p>
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
          <Card 
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`cursor-move transition-all ${draggedIndex === index ? 'opacity-50' : ''}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
                  <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                </div>
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

              {/* Preview Section */}
              <div className="space-y-2 border-t pt-4">
                <Label className="text-xs text-muted-foreground">Preview:</Label>
                {renderPreview(question)}
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
            {saving ? 'Creating...' : 'Create Form'}
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