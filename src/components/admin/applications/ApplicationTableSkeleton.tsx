
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

const ApplicationTableSkeleton: React.FC = () => {
  return (
    <TableBody className="relative">
      {/* Loading overlay for visibility */}
      <tr className="absolute inset-0 bg-white bg-opacity-60 z-10 pointer-events-none">
        <td className="w-full h-full">
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 font-medium">Loading applications...</p>
          </div>
        </td>
      </tr>
      
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="animate-pulse">
          <TableCell><Skeleton className="h-5 w-32 bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-40 bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-28 bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20 bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24 bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-28 bg-gray-200" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto bg-gray-200" /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default ApplicationTableSkeleton;
