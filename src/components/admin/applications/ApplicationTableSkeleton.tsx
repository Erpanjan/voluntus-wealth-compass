
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

const ApplicationTableSkeleton: React.FC = () => {
  return (
    <TableBody>
      {/* Overlay message that's less intrusive */}
      <tr className="absolute inset-0 bg-white bg-opacity-50 z-10 pointer-events-none">
        <td className="w-full h-full">
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 font-medium">Loading applications...</p>
          </div>
        </td>
      </tr>
      
      {/* Skeleton rows for visual feedback */}
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="relative">
          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
          <TableCell><Skeleton className="h-5 w-40" /></TableCell>
          <TableCell><Skeleton className="h-5 w-28" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-5 w-28" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default ApplicationTableSkeleton;
