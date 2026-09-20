"use client";
// AdminNewsEdit.js - reuses the same form as create
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
export { default } from '../../create/page';
