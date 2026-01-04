'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { LearningCard, Module } from '@/lib/types'
import { useAdmin } from '@/context/AdminContext'
import { Label } from './ui/label'
import { toast } from '@/hooks/use-toast'
import QuestionForm from './QuestionForm'
import { Trash2 } from 'lucide-react'


export default function EditModuleDialog({
  open,
  onOpenChange,
  modules,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  modules: Module[]
}) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [editedModule, setEditedModule] = useState<Module | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { updateModule, deleteModule } = useAdmin()

  const handleSelect = (mod: Module) => {
    setSelectedModule(mod)
    setEditedModule({ ...mod })
  }

  const handleChange = (field: keyof Module, value: any) => {
    if (editedModule) {
      setEditedModule({ ...editedModule, [field]: value })
    }
  }

  const handleSubmit = async () => {

    if (!editedModule) return
    try {
      setSubmitting(true)
      await updateModule(editedModule.id, editedModule) // handle PUT logic in backend
      // onOpenChange(false)
      toast({
        title: "Complete",
        description: "Module Edited Successfully. Kindly Refresh",
        variant: 'success'
      });
      setSelectedModule(null)
      setEditedModule(null)
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setSelectedModule(null)
    setEditedModule(null)
  }

  const handleSectionChange = (index: number, field: string, value: any) => {
    if (!editedModule) return;
    const updated = [...editedModule.sections];
    updated[index] = { ...updated[index], [field]: value };
    handleChange("sections", updated);
  };

  const addSection = () => {
    if (!editedModule) return;
    const newSection = { title: "", description: "", learningCards: [] };
    handleChange("sections", [...editedModule.sections, newSection]);
  };

  const removeSection = (index: number) => {
    if (!editedModule) return;
    const updated = editedModule.sections.filter((_, i) => i !== index);
    handleChange("sections", updated);
  };

  const handleLearningCardChange = (
    sectionIndex: number,
    cardIndex: number,
    field: "title" | "content" | "infographic",
    value: string
  ) => {
    if (!editedModule) return;
    const updatedSections = [...editedModule.sections];
    updatedSections[sectionIndex].learningCards[cardIndex][field] = value;
    handleChange("sections", updatedSections);
  };

  const addLearningCard = (sectionIndex: number) => {
    if (!editedModule) return;
    const updatedSections = [...editedModule.sections];
    const newCard: LearningCard = {
      name: "",
      title: "",
      content: "",
      infographic: "",
      order: (updatedSections[sectionIndex].learningCards?.length || 0) + 1,
    };
    updatedSections[sectionIndex].learningCards = [
      ...(updatedSections[sectionIndex].learningCards || []),
      newCard,
    ];
    handleChange("sections", updatedSections);
  };


  const removeLearningCard = (sectionIndex: number, cardIndex: number) => {
    if (!editedModule) return;
    const updatedSections = [...editedModule.sections];
    updatedSections[sectionIndex].learningCards = updatedSections[sectionIndex].learningCards.filter(
      (_, i) => i !== cardIndex
    );
    handleChange("sections", updatedSections);
  };


  const handleTestChange = (
    type: "preTest" | "postTest",
    index: number,
    field: string,
    value: any
  ) => {
    if (!editedModule) return;
    const updatedQuestions = [...editedModule[type].questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    handleChange(type, { ...editedModule[type], questions: updatedQuestions });
  };

  const addTestQuestion = (type: "preTest" | "postTest") => {
    if (!editedModule) return;

    const newQ = {
      question: "",
      options: ["", "", "", ""], // default 4 empty options
      correctAnswer: "",
      explanation: "",
    };

    const prev = editedModule[type] || { title: "", questions: [] };

    handleChange(type, {
      ...prev,
      questions: [...prev.questions, newQ],
    });
  };

  const removeTestQuestion = (type: "preTest" | "postTest", index: number) => {
    if (!editedModule) return;

    const prev = editedModule[type] || { title: "", questions: [] };
    const updatedQuestions = prev.questions.filter((_, i) => i !== index);

    handleChange(type, {
      ...prev,
      questions: updatedQuestions,
    });
  };

  const handleDelete = () => {
    console.log('deleted')
  }



  return (
    <Dialog open={open} onOpenChange={(open) => { onOpenChange(open); handleCancel(); }}>
      <DialogContent className="max-w-4xl max-h-screen  overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Edit Module</DialogTitle>
          <DialogDescription>
            <div className='flex justify-between'>
              <span>Click a module to begin editing.</span>

              {selectedModule && 
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <span className="flex gap-2 justify-center items-center">
                      <Trash2 /> Delete Module
                    </span>
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the module and all of its content.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className='bg-green-600 text-white'>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='bg-red-400 text-white' onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>}

            </div>
            
          </DialogDescription>
        </DialogHeader>

        {!selectedModule ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {modules.map((mod) => (
              <Button
                key={mod.id}
                variant="outline"
                onClick={() => handleSelect(mod)}
              >
                {mod.module}
              </Button>
            ))}
          </div>
        ) : editedModule && (
          <Tabs defaultValue="basic" className="w-full mt-4">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="intro">Intro</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="tests">Tests</TabsTrigger>
            </TabsList>

            {/* Basic Info */}
            <TabsContent value="basic">
              <div className="grid gap-4">
                <Input
                  value={editedModule.module}
                  onChange={(e) => handleChange('module', e.target.value)}
                  disabled
                  placeholder="module-1"
                />
                <Label htmlFor="title">Title</Label>
                <Input
                  value={editedModule.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Title"
                />

                  <Label htmlFor="description">Description</Label>
                <Textarea
                  value={editedModule.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Description"
                />
                <Label htmlFor="icon">Icon</Label>
                <Input
                  value={editedModule.icon}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  placeholder="Icon (e.g., BookOpen)"
                />
                <Label htmlFor='label'>Order</Label>
                <Input
                  type="number"
                  value={editedModule.order}
                  onChange={(e) => handleChange('order', parseInt(e.target.value))}
                  placeholder="Order"
                  disabled
                />
              </div>
            </TabsContent>

            {/* Intro Video */}
            <TabsContent value="intro">
              <Input
                value={editedModule.introVideo}
                onChange={(e) => handleChange('introVideo', e.target.value)}
                placeholder="Intro Video URL"
              />
            </TabsContent>

            {/* Sections */}
              <TabsContent value="sections">
                <div className="space-y-4">
                  {editedModule.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border p-4 rounded-lg space-y-2 bg-gray-100">
                      {/* Section Title */}
                      <Label htmlFor='section-title'>Section Title</Label>
                      <Input
                        value={section.title}
                        onChange={(e) =>
                          handleSectionChange(sectionIndex, "title", e.target.value)
                        }
                        placeholder="Section Title"
                      />

                      {/* Section Description */}
                      <Label htmlFor='section-description'>Description</Label>
                      <Textarea
                        value={section.description || ""}
                        onChange={(e) =>
                          handleSectionChange(sectionIndex, "description", e.target.value)
                        }
                        placeholder="Section Description"
                      />

                      {/* Learning Cards Editor */}
                      <div className="space-y-2 pl-2 border-l border-gray-300">
                        <h4 className="font-medium text-sm">Learning Cards</h4>
                        {section.learningCards?.map((card, cardIndex) => (
                          <div key={cardIndex} className="p-2 bg-white rounded border space-y-1">
                            <Label htmlFor='card-title'>Card Title</Label>
                            <Input
                              value={card.title}
                              onChange={(e) =>
                                handleLearningCardChange(sectionIndex, cardIndex, "title", e.target.value)
                              }
                              placeholder="Card Title"
                            />

                            <Label htmlFor='card-infographic'>Card infographic</Label>
                            <Input
                              value={card.infographic}
                              onChange={(e) =>
                                handleLearningCardChange(sectionIndex, cardIndex, "infographic", e.target.value)
                              }
                              placeholder="Card infographic"
                            />

                            <Label htmlFor='card-content'>Content</Label>
                            <Textarea
                              value={card.content}
                              onChange={(e) =>
                                handleLearningCardChange(sectionIndex, cardIndex, "content", e.target.value)
                              }
                              placeholder="Card Content"
                              rows={3}
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeLearningCard(sectionIndex, cardIndex)}
                            >
                              Remove Card
                            </Button>
                          </div>
                        ))}

                        <Button
                          size="sm"
                          onClick={() => addLearningCard(sectionIndex)}
                        >
                          Add Learning Card
                        </Button>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSection(sectionIndex)}
                      >
                        Remove Section
                      </Button>
                    </div>
                  ))}

                  <Button onClick={addSection}>Add Section</Button>
                </div>
              </TabsContent>



            {/* Pre/Post Tests */}
              <TabsContent value="tests">
                <div className="space-y-8">
                  {/* Pre-Test Section */}
                  <div>
                    <h3 className="font-semibold text-sm">Pre-Test Questions</h3>
                    <QuestionForm
                      type="preTest"
                      questions={editedModule.preTest?.questions || []}
                      onChange={handleTestChange}
                      onRemove={removeTestQuestion}
                    />
                    <Button size="sm" onClick={() => addTestQuestion("preTest")} className="mt-2">
                      Add Pre-Test Question
                    </Button>
                  </div>

                  {/* Post-Test Section */}
                  <div>
                    <h3 className="font-semibold text-sm">Post-Test Questions</h3>
                    <QuestionForm
                      type="postTest"
                      questions={editedModule.postTest?.questions || []}
                      onChange={handleTestChange}
                      onRemove={removeTestQuestion}
                    />
                    <Button size="sm" onClick={() => addTestQuestion("postTest")} className="mt-2">
                      Add Post-Test Question
                    </Button>
                  </div>
                </div>
              </TabsContent>

          </Tabs>
        )}

        {selectedModule && (
          <DialogFooter className="mt-6">
            <Button onClick={handleCancel} variant="ghost">
              Cancel
            </Button>
            <Button disabled={submitting} onClick={handleSubmit}>
              {submitting ? "Saving" : "Save Changes"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
