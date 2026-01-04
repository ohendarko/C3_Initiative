import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/context/AdminContext';
// import { Module, Section, LearningCard, PostTest } from '@/types/admin';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Module, Section, PreTest, PostTest, LearningCard, Question, newModule } from '@/lib/types';

interface CreateModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateModuleDialog({ open, onOpenChange }: CreateModuleDialogProps) {
  const { addModule, modules, stats } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [totalModules, setTotalModules] = useState(stats.totalModules)


  
  const [moduleData, setModuleData] = useState<newModule>({
    module: `module-${totalModules + 1}`,
    completed: false,
    unlocked: false,
    icon: 'BookOpen',
    title: '',
    name: '',
    description: '',
    order: 1,
    introVideo: '',
    sections: [],
    preTest: {
      name: `pretest-${totalModules + 1}`,
      questions: []
    },
    postTest: {
      name: `posttest-${totalModules + 1}`,
      questions: []
    }
  });


  const [sections, setSections] = useState<Section[]>([]);
  const [postTests, setPostTests] = useState<PostTest[]>([]);

  useEffect(() => {
    if (stats?.totalModules !== undefined) {
      setTotalModules(stats.totalModules);

      setModuleData({
        module: `module-${stats.totalModules + 1}`,
        completed: false,
        unlocked: false,
        icon: 'BookOpen',
        title: '',
        name: '',
        description: '',
        order: 1,
        introVideo: '',
        sections: [],
        preTest: {
          name: `pretest-${stats.totalModules + 1}`,
          questions: []
        },
        postTest: {
          name: `posttest-${stats.totalModules + 1}`,
          questions: []
        },
        updatedAt: new Date()
      });
    }
  }, [stats.totalModules]);


  const addSection = () => {
    // console.log('add section clicked')
    console.log(moduleData)
    console.log('total modules: ', totalModules)
    
    // console.log(moduleData.sections)
    const newSection: Section = {
      name: `section-${totalModules + 1}-${moduleData.sections.length + 1}`,
      title: '',
      description: '',
      order: moduleData.sections.length + 1,
      learningCards: [],
      quizzes: []
    };
    setModuleData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };


  const updateSection = <K extends keyof Section>(index: number, field: K, value: Section[K]) => {
    const newSections = [...moduleData.sections];
    newSections[index][field] = value;
    setModuleData(prev => ({ ...prev, sections: newSections }));
  };


  const removeSection = (index: number) => {
    setModuleData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const addLearningCard = (sectionIndex: number) => {
    const newCard: LearningCard = {
      name: `section-${stats.totalModules + 1}-${sectionIndex + 1}-card-${moduleData.sections[sectionIndex].learningCards.length + 1}`,
      title: '',
      content: '',
      infographic: '/images/placeholder.svg',
      order: moduleData.sections[sectionIndex].learningCards.length + 1
    };

    const updatedSections = [...moduleData.sections];
    updatedSections[sectionIndex].learningCards.push(newCard);
    setModuleData(prev => ({ ...prev, sections: updatedSections }));
  };

  const updateLearningCard = (
    sectionIndex: number,
    cardIndex: number,
    field: 'title' | 'content' | 'infographic',
    value: string
  ) => {
    setModuleData((prev) => {
      const updatedSections = [...prev.sections];
      const updatedCards = [...updatedSections[sectionIndex].learningCards];

      updatedCards[cardIndex] = {
        ...updatedCards[cardIndex],
        [field]: value
      };

      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        learningCards: updatedCards
      };

      return { ...prev, sections: updatedSections };
    });
  };


  const removeLearningCard = (sectionIndex: number, cardIndex: number) => {
    setModuleData(prev => {
      const updatedSections = [...prev.sections];
      const updatedLearningCards = updatedSections[sectionIndex].learningCards.filter(
        (_, i) => i !== cardIndex
      );

      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        learningCards: updatedLearningCards,
      };

      return {
        ...prev,
        sections: updatedSections,
      };
    });
  };



  const addPostTest = () => {
    const newQuestion: Question = {
      order: moduleData.postTest.questions.length + 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: ''
    };

    setModuleData(prev => ({
      ...prev,
      postTest: {
        ...prev.postTest,
        questions: [...prev.postTest.questions, newQuestion]
      }
    }));
  };

  const addPreTest = () => {
    const newQuestion: Question = {
      order: moduleData.preTest.questions.length + 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: ''
    };

    setModuleData(prev => ({
      ...prev,
      preTest: {
        ...prev.preTest,
        questions: [...prev.preTest.questions, newQuestion]
      }
    }));
  };

  const updatePreTest = (
    field: keyof Question,
    value: string | string[],
    questionIndex: number
  ) => {
    setModuleData((prev) => {
      const updatedQuestions = [...prev.preTest.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        [field]: value,
      };

      return {
        ...prev,
        preTest: {
          ...prev.preTest,
          questions: updatedQuestions,
        },
      };
    });
  };


  const updatePostTest = (
    field: keyof Question,
    value: string | string[],
    questionIndex: number
  ) => {
    setModuleData((prev) => {
      const updatedQuestions = [...prev.postTest.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        [field]: value,
      };

      return {
        ...prev,
        postTest: {
          ...prev.postTest,
          questions: updatedQuestions,
        },
      };
    });
  };

  const removePreTest = (index: number) => {
    setModuleData(prev => ({
      ...prev,
      preTest: {
        ...prev.preTest,
        questions: prev.preTest.questions.filter((_, i) => i !== index)
      }
    }));
  };

  const removePostTest = (index: number) => {
    setModuleData(prev => ({
      ...prev,
      postTest: {
        ...prev.postTest,
        questions: prev.postTest.questions.filter((_, i) => i !== index)
      }
    }));
  };

  function transformModuleForPrisma(moduleData: any) {
    return {
      module: moduleData.module,
      order: moduleData.order,
      title: moduleData.title,
      description: moduleData.description,
      icon: moduleData.icon,
      introVideo: moduleData.introVideo,
      completed: moduleData.completed,
      unlocked: moduleData.unlocked,
      preTest: {
        create: {
          name: moduleData.preTest.name,
          questions: {
            create: moduleData.preTest.questions.map((q: any) => ({
              order: q.order,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
            })),
          },
        },
      },
      postTest: {
        create: {
          name: moduleData.postTest.name,
          questions: {
            create: moduleData.postTest.questions.map((q: any) => ({
              order: q.order,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
            })),
          },
        },
      },
      sections: {
        create: moduleData.sections.map((section: any) => ({
          name: section.name,
          title: section.title,
          description: section.description,
          order: section.order,
          learningCards: {
            create: section.learningCards.map((card: any) => ({
              name: card.name,
              title: card.title,
              content: card.content,
              infographic: card.infographic,
              order: card.order,
            })),
          },
          quizzes: {
            create: section.quizzes.map((quiz: any) => ({
              order: quiz.order,
              question: quiz.question,
              options: quiz.options,
              correctAnswer: quiz.correctAnswer,
              explanation: quiz.explanation,
            })),
          },
        })),
      },
    };
  }


  const handleSave = async () => {
    console.log(moduleData)
    if (!moduleData.title || !moduleData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const formatted = transformModuleForPrisma(moduleData);
      const success = await addModule(moduleData);
      if (success && success.status === 'successful') {
        toast({
          title: "Complete",
          description: "Module Created Successfully",
          variant: 'success'
        });
        setModuleData({
          module: '',
          completed: false,
          unlocked: false,
          icon: 'BookOpen',
          title: '',
          description: '',
          order: 1,
          name: '',
          introVideo: '',
          sections: [],
          preTest: {
            name: '',
            questions: []
          },
          postTest: {
            name: '',
            questions: []
          }
          // onOpenChange(false);
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create module.",
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Learning Module</DialogTitle>
          <DialogDescription>
            Fill in the details to create a comprehensive learning module.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Module Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="module">Module ID</Label>
              <Input
                id="module"
                value={moduleData.module}
                onChange={(e) => setModuleData(prev => ({ ...prev, module: e.target.value }))}
                placeholder="module-1"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="module">Module ID</Label>
              <Input
                id="name"
                value={moduleData.name}
                onChange={(e) => setModuleData(prev => ({ ...prev, module: e.target.value }))}
                placeholder="Module X"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={moduleData.icon}
                onChange={(e) => setModuleData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="BookOpen"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={moduleData.title}
              onChange={(e) => setModuleData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Module Title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={moduleData.description}
              onChange={(e) => setModuleData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Module description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={moduleData.order}
                onChange={(e) => setModuleData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="introVideo">Intro Video URL</Label>
              <Input
                id="introVideo"
                value={moduleData.introVideo}
                onChange={(e) => setModuleData(prev => ({ ...prev, introVideo: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Sections */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Sections</h3>
              <Button onClick={addSection} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>

            {moduleData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Section {sectionIndex + 1}</h4>
                  <Button
                    onClick={() => removeSection(sectionIndex)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Section Title</Label>
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                      placeholder="Section title"
                    />
                  </div>
                  <div>
                    <Label>Order</Label>
                    <Input
                      type="number"
                      value={section.order}
                      onChange={(e) => updateSection(sectionIndex, 'order', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label>Description</Label>
                  <Textarea
                    value={section.description}
                    onChange={(e) => updateSection(sectionIndex, 'description', e.target.value)}
                    placeholder="Section description"
                    rows={2}
                  />
                </div>

                {/* Learning Cards */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Learning Cards</Label>
                    <Button
                      onClick={() => addLearningCard(sectionIndex)}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Card
                    </Button>
                  </div>

                  {moduleData.sections[sectionIndex]?.learningCards.map((card, cardIndex) => (
                    <div key={cardIndex} className="border-l-2 border-blue-200 pl-4 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Card {cardIndex + 1}</span>
                        <Button
                          onClick={() => removeLearningCard(sectionIndex, cardIndex)}
                          size="sm"
                          variant="ghost"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid gap-2">
                        <Input
                          value={card.title}
                          onChange={(e) => updateLearningCard(sectionIndex, cardIndex, 'title', e.target.value)}
                          placeholder="Card title"
                          className="text-sm"
                        />
                        <Input
                          value={card.infographic}
                          onChange={(e) => updateLearningCard(sectionIndex, cardIndex, 'infographic', e.target.value)}
                          placeholder="Card Infographic"
                          className="text-sm"
                        />
                        <Textarea
                          value={card.content}
                          onChange={(e) => updateLearningCard(sectionIndex, cardIndex, 'content', e.target.value)}
                          placeholder="Card content"
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pre Tests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Pre Tests / Questionnaire </h3>
              <Button onClick={addPreTest} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {moduleData.preTest.questions.map((test, testIndex) => (
              <div key={testIndex} className="border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Question {testIndex + 1}</h4>
                  <Button
                    onClick={() => removePreTest(testIndex)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mb-4">
                  <Label>Question</Label>
                  <Input
                    value={test.question || ""}
                    onChange={(e) => updatePreTest('question', e.target.value, testIndex)}
                    placeholder="Enter question"
                  />
                </div>

                <div className="mb-4">
                  <Label>Answer Options</Label>
                  {test.options.map((option, optionIndex) => (
                    <Input
                      key={optionIndex}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...test.options];
                        newOptions[optionIndex] = e.target.value;
                        updatePreTest('options', newOptions, testIndex);
                      }}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="mb-2"
                    />
                  ))}
                </div>

                <div>
                  <Label>Correct Answer</Label>
                  <Input
                    value={test.correctAnswer}
                    onChange={(e) => updatePreTest('correctAnswer', e.target.value, testIndex)}
                    placeholder="Enter correct answer"
                    className='mb-2'
                  />
                </div>

                <div>
                  <Label>Explanation</Label>
                  <Input
                    value={test.explanation}
                    onChange={(e) => updatePreTest('explanation', e.target.value, testIndex)}
                    placeholder="Enter explanation"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Post Tests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Post Tests</h3>
              <Button onClick={addPostTest} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {moduleData.postTest.questions.map((test, testIndex) => (
              <div key={testIndex} className="border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Question {testIndex + 1}</h4>
                  <Button
                    onClick={() => removePostTest(testIndex)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mb-4">
                  <Label>Question</Label>
                  <Input
                    value={test.question || ""}
                    onChange={(e) => updatePostTest('question', e.target.value, testIndex)}
                    placeholder="Enter question"
                  />
                </div>

                <div className="mb-4">
                  <Label>Answer Options</Label>
                  {test.options.map((option, optionIndex) => (
                    <Input
                      key={optionIndex}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...test.options];
                        newOptions[optionIndex] = e.target.value;
                        updatePostTest('options', newOptions, testIndex);
                      }}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="mb-2"
                    />
                  ))}
                </div>

                <div>
                  <Label>Correct Answer</Label>
                  <Input
                    value={test.correctAnswer}
                    onChange={(e) => updatePostTest('correctAnswer', e.target.value, testIndex)}
                    placeholder="Enter correct answer"
                    className='mb-2'
                  />
                </div>

                <div>
                  <Label>Explanation</Label>
                  <Input
                    value={test.explanation}
                    onChange={(e) => updatePostTest('explanation', e.target.value, testIndex)}
                    placeholder="Enter explanation"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Creating...' : 'Create Module'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
