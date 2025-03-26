'use client'

import React, { useEffect } from 'react'
import { useView } from './utils/useView';

export default function ViewDetector({ children }: { children: React.ReactNode }) {
   useView();

   return null;
}

