"use client";
// AdminNewsEdit.js - reuses the same form as create
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
export { default } from '../../create/page';
