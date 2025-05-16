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
import { alpha } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { ProblemApi } from 'features/problem/api';
import { TestcaseApi } from 'features/testcase/api';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { ContestApi } from 'features/contest/api';
import { useSession } from 'next-auth/react';
import Loading from '@/components/Loading';

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
  rating?: number;
  score?: number;
  timeLimit: number;
  memoryLimit: number;
  samples: {
    input: string;
    output: string;
  }[];
}

const hasContestStarted = (startTime: string): boolean => {
  const contestStart = new Date(startTime);
  const now = new Date();
  return now >= contestStart;
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

const RichTextEditor = ({ initialValue, editorRef, disabled }: EditorProps) => {
  const handleImageUpload = async (blobInfo: any) => {
    try {
      // Convert blob to File object
      const file = new File([blobInfo.blob()], blobInfo.filename(), {
        type: blobInfo.blob().type,
      });

      // Upload image using ProblemApi
      const imageUrl = await ProblemApi.uploadImage(file);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

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
        automatic_uploads: true,
        images_reuse_filename: true,
        images_upload_base_path: '/api/v1/problem/upload',
        images_upload_credentials: true,
        // Add image upload validation
        images_upload_handler: async (blobInfo: any) => {
          // Validate file size (5MB limit)
          if (blobInfo.blob().size > 5 * 1024 * 1024) {
            throw new Error('Image size should be less than 5MB');
          }

          // Validate file type
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
          if (!allowedTypes.includes(blobInfo.blob().type)) {
            throw new Error('Only JPG, PNG and GIF images are allowed');
          }

          return handleImageUpload(blobInfo);
        },
      }}
    />
  );
};

export default function ProblemForm() {
  const params = useParams();
  const router = useRouter();

  const { data: session, status: sessionStatus } = useSession();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [problemData, setProblemData] = useState<ProblemData>({
    name: '',
    content: '',
    tags: [],
    timeLimit: 1000,
    score: 100,
    rating: 500,
    memoryLimit: 256 * 1024 * 1024,
    samples: [{ input: '', output: '' }],
  });
  const editorRef = useRef<any>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const { enqueueSnackbar } = useSnackbar();
  const [userRole, setUserRole] = useState<{
    isAuthor: boolean;
    isCoordinator: boolean;
    isTester: boolean;
  }>({ isAuthor: false, isCoordinator: false, isTester: false });

  const contestId = params.id as string;
  const problemId = params.action !== 'new' ? (params.action as string) : null;

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

  const checkUserAccess = async (contestId: string, userId: string) => {
    try {
      const contest = await ContestApi.getContest(contestId);

      // Check if the user has any role in this contest
      const isAuthor =
        Array.isArray(contest.authors) && contest.authors.includes(userId);
      const isCoordinator =
        Array.isArray(contest.coordinators) &&
        contest.coordinators.includes(userId);
      const isTester =
        Array.isArray(contest.testers) && contest.testers.includes(userId);
      const isCreator = contest.createdBy === userId;

      // If user has no role, redirect
      if (!isAuthor && !isCoordinator && !isTester && !isCreator) {
        router.push('/not-found');
        return {
          isAuthor: false,
          isCoordinator: false,
          isTester: false,
        };
      }

      return {
        isAuthor: isAuthor || isCreator, // Consider creator as author too
        isCoordinator,
        isTester,
      };
    } catch (error) {
      console.error('Failed to check user access:', error);
      enqueueSnackbar('Error checking contest permissions', {
        variant: 'error',
        autoHideDuration: 3000,
      });

      return {
        isAuthor: false,
        isCoordinator: false,
        isTester: false,
      };
    }
  };

  useEffect(() => {
    const validateAccess = async () => {
      if (!session?.user?.id) {
        // If no user session, wait briefly and try again
        const timer = setTimeout(() => validateAccess(), 500);

        // Clean up timeout if component unmounts
        return () => clearTimeout(timer);
      }

      setInitialLoading(true);

      try {
        const contest = await ContestApi.getContest(contestId);

        // Check if contest exists
        if (!contest) {
          enqueueSnackbar('Contest not found', {
            variant: 'error',
            autoHideDuration: 3000,
          });
          router.push('/not-found');
          return;
        }

        // Check if contest has started
        if (hasContestStarted(contest.startTime)) {
          enqueueSnackbar('Cannot modify problems after contest has started', {
            variant: 'error',
            autoHideDuration: 3000,
          });
          router.push(`/contests/${contestId}`);
          return;
        }

        // Check user access with proper error handling
        const userId = session.user.id;
        const access = await checkUserAccess(contestId, userId);
        setUserRole(access);

        // Only for new problem creation - check if user is author
        if (!problemId && !access.isAuthor) {
          enqueueSnackbar('Only authors can create new problems', {
            variant: 'error',
            autoHideDuration: 3000,
          });
          router.push(`/contests/${contestId}`);
          return;
        }

        // Continue with the rest of the initialization
        if (problemId) {
          await validateAndFetchProblem();
        }
      } catch (error) {
        console.error('Failed to validate access:', error);
        enqueueSnackbar('Failed to verify permissions', {
          variant: 'error',
          autoHideDuration: 3000,
        });
        router.push(`/contests/${contestId}`);
      } finally {
        setInitialLoading(false);
      }
    };

    // Separate the problem fetching logic
    const validateAndFetchProblem = async () => {
      try {
        // If not new, validate problemId is numeric
        if (problemId) {
          if (!/^\d+$/.test(problemId)) {
            router.push('/not-found');
            return;
          }

          // Fetch problem and testcases in parallel
          const [problem, testcases] = await Promise.all([
            ProblemApi.getProblem(problemId),
            TestcaseApi.getTestcases(problemId),
          ]);

          // Validate problem belongs to current contest
          if (problem.contest.toString() !== contestId) {
            router.push('/not-found');
            return;
          }

          // Update form data
          setProblemData({
            name: problem.title,
            content: problem.statement,
            tags: problem.tags || [],
            timeLimit: problem.timeLimit,
            score: problem.score,
            rating: problem.rating,
            memoryLimit: problem.memoryLimit,
            samples: testcases.map((tc) => ({
              input: tc.input,
              output: tc.output,
            })),
          });
        }
      } catch (error) {
        console.error('Failed to fetch problem:', error);
        enqueueSnackbar('Failed to load problem', {
          variant: 'error',
          autoHideDuration: 3000,
        });
      }
    };

    // Start the validation process
    validateAccess();

    // This effect depends on session, problemId, and contestId
  }, [session, problemId, contestId, router, enqueueSnackbar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const content = editorRef.current?.getContent() || '';
      const problemPayload = {
        title: problemData.name,
        statement: content,
        solution: '', // Will be added later
        timeLimit: problemData.timeLimit,
        memoryLimit: problemData.memoryLimit,
        rating: problemData.rating || 500,
        score: problemData.score || 100,
        contest: contestId,
        tags: problemData.tags,
      };

      if (problemId) {
        // Update existing problem
        await ProblemApi.updateProblem(problemId, problemPayload);
        // Update testcases logic here if needed
        // Delete all existing testcases and create new ones
        await TestcaseApi.deleteTestcases(problemId);
        await TestcaseApi.createBatchTestcase({
          problem: problemId,
          data: problemData.samples.map((sample) => ({
            input: sample.input,
            output: sample.output,
            problem: problemId,
          })),
        });
      } else {
        // Create new problem
        const problem = await ProblemApi.createProblem(problemPayload);
        if (problem.id) {
          await TestcaseApi.createBatchTestcase({
            problem: problem.id,
            data: problemData.samples.map((sample) => ({
              input: sample.input,
              output: sample.output,
              problem: problem.id,
            })),
          });
        }
      }

      enqueueSnackbar(
        `Problem ${problemId ? 'updated' : 'created'} successfully!`,
        { variant: 'success', autoHideDuration: 3000 }
      );
      router.push(`/contests/${contestId}`);
    } catch (error: any) {
      console.error('Failed to create problem:', error);
      enqueueSnackbar(error?.message || 'Failed to create problem', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const generateScoreOptions = () => {
    const scores = [500];
    for (let i = 1000; i <= 3500; i += 100) {
      scores.push(i);
    }
    return scores;
  };

  const scoreOptions = generateScoreOptions();

  const getRatingColor = (rating: number): string => {
    if (rating < 1000) return '#808080'; // gray
    if (rating < 1500) return '#008000'; // green
    if (rating < 2000) return '#03A89E'; // cyan
    if (rating < 2500) return '#0000FF'; // blue
    if (rating < 3000) return '#AA00AA'; // purple
    return '#FF0000'; // red
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
    if (userRole.isAuthor) return false;
    if (userRole.isCoordinator) return true;
    if (userRole.isTester) return fieldType !== 'testcase';
    return true;
  };

  const getRoleAlert = () => {
    if (userRole.isCoordinator) {
      return (
        <Alert severity="info" sx={{ mb: 3 }}>
          You are in view-only mode as a Coordinator.
        </Alert>
      );
    }
    if (userRole.isTester) {
      return (
        <Alert severity="info" sx={{ mb: 3 }}>
          As a Tester, you can only modify test cases.
        </Alert>
      );
    }
    return null;
  };

  // Show loading state while fetching initial data
  if (initialLoading || sessionStatus === 'loading') {
    return <Loading />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {problemId ? 'Edit Problem' : 'Create New Problem'}
        </Typography>

        {getRoleAlert()}

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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Score"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">points</InputAdornment>
                    ),
                  }}
                  required
                  fullWidth
                  disabled={isFieldDisabled('general')}
                  value={problemData.score}
                  onChange={(e) =>
                    setProblemData((prev) => ({
                      ...prev,
                      score: parseInt(e.target.value),
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Problem Rating
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    maxWidth: '100%',
                    overflowX: 'auto',
                    pb: 1,
                  }}
                >
                  {scoreOptions.map((score) => (
                    <Button
                      key={score}
                      variant={
                        problemData.rating === score ? 'contained' : 'outlined'
                      }
                      size="small"
                      onClick={() =>
                        setProblemData((prev) => ({ ...prev, rating: score }))
                      }
                      disabled={isFieldDisabled('general')}
                      sx={{
                        minWidth: '70px',
                        bgcolor:
                          problemData.rating === score
                            ? () => `${getRatingColor(score)} !important`
                            : 'transparent',
                        borderColor: getRatingColor(score),
                        color:
                          problemData.rating === score
                            ? 'white'
                            : getRatingColor(score),
                        '&:hover': {
                          bgcolor: () => alpha(getRatingColor(score), 0.1),
                        },
                      }}
                    >
                      {score}
                    </Button>
                  ))}
                </Box>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Test Cases
              {userRole.isTester && (
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
              disabled={!userRole.isAuthor && !userRole.isTester}
            >
              {problemId ? 'Update Problem' : 'Create Problem'}
            </LoadingButton>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
