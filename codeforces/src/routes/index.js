import { lazy } from 'react';
import { Login } from '../components/home';
import Home from '../containers/public/Home';
import Blogs from '../components/home/Blogs';
import Profile from '../components/home';
import Calendar from '../components/home';
import path from '../utils/path';
import Login from "./Login";
import { CreateProblem, Rating, SearchList } from ".";
import SignUp from '../components/home';
import Setting from '../components/home/Setting';
import BlogDetail from '../components/home/BlogDetail';
import Ide from '../components/CodeEditor/Components/Ide';
import Problem from '../components/home/Problem';
import RichTextInput from '../components/RichTextInput';
import Problems from '../components/home/Problems';
import EditProblem from '../components/home/EditProblem';
import EditBlog from '../components/home/EditBlog';
import Submission from '../components/home/Submission';
import SubmitDetail from '../components/home/SubmitDetail';
import UserBlog from '../components/home/UserBlog';
import ForgotPassword from '../components/home/ForgotPassword';
import ResetPassword from '../components/home/ResetPassword';
// Lazy load components
const Blogs = lazy(() => import('../components/home/Blogs'));
const Profile = lazy(() => import('../components/home/Profile'));
// ...import other components

export const publicRoutes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/signup',
    component: SignUp,
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
  },
  {
    path: '/reset-password',
    component: ResetPassword,
  },
  {
    path: '/problems',
    component: Problems,
  },
  {
    path: '/problem/:id',
    component: Problem,
  },
  {
    path: '/ide',
    component: Ide,
  },
];

export const privateRoutes = [
  // ...other private routes
];