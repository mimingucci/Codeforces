'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Stack,
  Button,
  Chip,
  Box,
  Autocomplete,
  InputAdornment,
  Grid,
  Alert,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { LoadingButton } from '@mui/lab';

interface EditorProps {
  initialValue: string;
  editorRef: React.MutableRefObject<any>;
  disabled?: boolean;
}

interface FormErrors {
  name?: string;
  content?: string;
  samples?: string;
}

interface ProblemData {
  id?: string;
  name: string;
  content: string;
  tags: string[];
  timeLimit: number;
  memoryLimit: number;
  samples: {
    input: string;
    output: string;
  }[];
}

type UserRole = 'AUTHOR' | 'COORDINATOR' | 'TESTER';

// Mock current user
const mockCurrentUser = {
  id: '1',
  role: 'COORDINATOR' as UserRole, // Change this to test different roles
};

// Mock available tags
const availableTags = [
  'implementation',
  'dp',
  'math',
  'greedy',
  'data structures',
  'graphs',
  'sortings',
  'binary search',
  'dfs and similar',
  'trees',
];

// Mock problem data for edit mode
const mockProblem: ProblemData = {
  id: '1',
  name: 'Binary Search',
  content: '# Problem Statement\nImplement binary search...',
  tags: ['binary search', 'implementation'],
  timeLimit: 1000,
  memoryLimit: 256 * 1024 * 1024, // 256MB
  samples: [
    {
      input: '5\n1 2 3 4 5\n3',
      output: '2',
    },
  ],
};

const RichTextEditor = ({ initialValue, editorRef, disabled }: EditorProps) => {
  return (
    <Editor
      apiKey="u9dip03wlnenlzj8lqd91ows2jqq8ez9p14k3melb4vchevu" // Get this from https://www.tiny.cloud/
      initialValue={initialValue}
      onInit={(evt, editor) => (editorRef.current = editor)}
      disabled={disabled}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount',
          'codesample',
        ],
        toolbar:
          'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image | codesample | help',
        content_style:
          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        file_picker_types: 'image',
        images_upload_handler: async (blobInfo: any) => {
          // Implement your image upload logic here
          // This is just a mock implementation
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blobInfo?.blob());
            reader.onload = () => {
              resolve(reader.result as string);
            };
            reader.onerror = (error) => reject(error);
          });
        },
        codesample_languages: [
          { text: 'C++', value: 'cpp' },
          { text: 'Java', value: 'java' },
          { text: 'Python', value: 'python' },
        ],
      }}
    />
  );
};

export default function ProblemForm() {
  const params = useParams();
  const isEdit = params.action === 'edit';
  const [loading, setLoading] = useState(false);
  const [problemData, setProblemData] = useState<ProblemData>({
    name: '',
    content: '',
    tags: [],
    timeLimit: 1000,
    memoryLimit: 256 * 1024 * 1024,
    samples: [{ input: '', output: '' }],
  });
  const editorRef = useRef<any>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!problemData.name.trim()) {
      newErrors.name = 'Problem name is required';
    }

    // Validate content
    const content = editorRef.current?.getContent() || '';
    if (!content.trim()) {
      newErrors.content = 'Problem statement is required';
    }

    // Validate samples
    const hasEmptySample = problemData.samples.some(
      (sample) => !sample.input.trim() || !sample.output.trim()
    );
    if (hasEmptySample) {
      newErrors.samples = 'All test cases must have both input and output';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isEdit) {
      // In edit mode, load problem data
      setProblemData(mockProblem);
    }
  }, [isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Get editor content when submitting
      const content = editorRef.current?.getContent() || '';
      const dataToSubmit = {
        ...problemData,
        content,
      };

      // Add your API call here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(dataToSubmit);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSample = () => {
    setProblemData((prev) => ({
      ...prev,
      samples: [...prev.samples, { input: '', output: '' }],
    }));
  };

  const handleRemoveSample = (index: number) => {
    setProblemData((prev) => ({
      ...prev,
      samples: prev.samples.filter((_, i) => i !== index),
    }));
  };

  // Function to check if fields should be disabled based on role
  const isFieldDisabled = (fieldType: 'general' | 'testcase') => {
    switch (mockCurrentUser.role) {
      case 'AUTHOR':
        return false; // Authors can edit everything
      case 'COORDINATOR':
        return true; // Coordinators can't edit anything
      case 'TESTER':
        return fieldType !== 'testcase'; // Testers can only edit test cases
      default:
        return true;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? 'Edit Problem' : 'Create New Problem'}
        </Typography>

        {mockCurrentUser.role === 'COORDINATOR' && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You are in view-only mode as a Coordinator.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {/* Show general error messages if any */}
            {Object.values(errors).length > 0 && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Please fix the following errors:
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <TextField
              label="Problem Name"
              required
              fullWidth
              value={problemData.name}
              onChange={(e) =>
                setProblemData((prev) => ({ ...prev, name: e.target.value }))
              }
              error={!!errors.name}
              helperText={errors.name}
              disabled={isFieldDisabled('general')}
            />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Problem Statement
              </Typography>
              <RichTextEditor
                initialValue={problemData.content}
                editorRef={editorRef}
                disabled={isFieldDisabled('general')} // Add disabled prop to Editor component
              />
              {errors.content && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {errors.content}
                </Typography>
              )}
            </Box>

            <Autocomplete
              multiple
              options={availableTags}
              value={problemData.tags}
              disabled={isFieldDisabled('general')}
              onChange={(_, newValue) =>
                setProblemData((prev) => ({ ...prev, tags: newValue }))
              }
              renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Add tags" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Time Limit"
                  type="number"
                  required
                  fullWidth
                  disabled={isFieldDisabled('general')}
                  value={problemData.timeLimit}
                  onChange={(e) =>
                    setProblemData((prev) => ({
                      ...prev,
                      timeLimit: parseInt(e.target.value),
                    }))
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">ms</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Memory Limit"
                  type="number"
                  required
                  fullWidth
                  disabled={isFieldDisabled('general')}
                  value={problemData.memoryLimit / (1024 * 1024)}
                  onChange={(e) =>
                    setProblemData((prev) => ({
                      ...prev,
                      memoryLimit: parseInt(e.target.value) * 1024 * 1024,
                    }))
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">MB</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Test Cases
              {mockCurrentUser.role === 'TESTER' && (
                <Typography variant="caption" color="primary" sx={{ ml: 2 }}>
                  (You can edit test cases as a Tester)
                </Typography>
              )}
            </Typography>

            {errors.samples && (
              <Typography color="error" variant="caption">
                {errors.samples}
              </Typography>
            )}

            {problemData.samples.map((sample, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: isFieldDisabled('testcase')
                    ? 'action.disabledBackground'
                    : 'inherit',
                }}
              >
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="subtitle1">
                      Testcase #{index + 1}
                    </Typography>
                    {index > 0 && !isFieldDisabled('testcase') && (
                      <Button
                        color="error"
                        onClick={() => handleRemoveSample(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                  <TextField
                    label="Input"
                    multiline
                    rows={3}
                    fullWidth
                    value={sample.input}
                    onChange={(e) => {
                      const newSamples = [...problemData.samples];
                      newSamples[index].input = e.target.value;
                      setProblemData((prev) => ({
                        ...prev,
                        samples: newSamples,
                      }));
                    }}
                    disabled={isFieldDisabled('testcase')}
                  />
                  <TextField
                    label="Output"
                    multiline
                    rows={3}
                    fullWidth
                    value={sample.output}
                    onChange={(e) => {
                      const newSamples = [...problemData.samples];
                      newSamples[index].output = e.target.value;
                      setProblemData((prev) => ({
                        ...prev,
                        samples: newSamples,
                      }));
                    }}
                    disabled={isFieldDisabled('testcase')}
                  />
                </Stack>
              </Paper>
            ))}

            {!isFieldDisabled('testcase') && (
              <Button variant="outlined" onClick={handleAddSample}>
                Add Test Case
              </Button>
            )}

            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={loading}
            >
              {isEdit ? 'Update Problem' : 'Create Problem'}
            </LoadingButton>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
