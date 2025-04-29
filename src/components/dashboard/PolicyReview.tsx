
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface Policy {
  id: string;
  name: string;
  purpose: string;
  currentValue: number;
  initialInvestment: number;
  performance: number;
  risk: 'Low' | 'Moderate' | 'High';
  lastUpdated: string;
}

const policies: Policy[] = [
  {
    id: 'p1',
    name: 'Retirement Plan',
    purpose: 'Long-term retirement savings',
    currentValue: 185000,
    initialInvestment: 150000,
    performance: 23.3,
    risk: 'Moderate',
    lastUpdated: '2025-04-15'
  },
  {
    id: 'p2',
    name: 'College Fund',
    purpose: 'Education savings for children',
    currentValue: 75000,
    initialInvestment: 70000,
    performance: 7.1,
    risk: 'Low',
    lastUpdated: '2025-04-10'
  },
  {
    id: 'p3',
    name: 'Growth Portfolio',
    purpose: 'Capital appreciation',
    currentValue: 120000,
    initialInvestment: 100000,
    performance: 20,
    risk: 'High',
    lastUpdated: '2025-04-18'
  }
];

const PolicyReview = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'Low': return 'bg-green-500';
      case 'Moderate': return 'bg-yellow-500';
      case 'High': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div>
      {!selectedPolicy ? (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Your Investment Policies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <Card key={policy.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className={`w-16 h-1 ${getRiskColor(policy.risk)} mb-4 rounded-full`}></div>
                  <CardTitle>{policy.name}</CardTitle>
                  <CardDescription>{policy.purpose}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Current Value</span>
                        <span className="font-medium">{formatCurrency(policy.currentValue)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Performance</span>
                        <span className={`font-medium ${policy.performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {policy.performance > 0 ? '+' : ''}{policy.performance}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Risk Level</span>
                        <span className="font-medium">{policy.risk}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => setSelectedPolicy(policy)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{selectedPolicy.name}</h2>
            <Button variant="outline" onClick={() => setSelectedPolicy(null)}>
              Back to All Policies
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedPolicy.name}</CardTitle>
                  <CardDescription>{selectedPolicy.purpose}</CardDescription>
                </div>
                <div className={`px-3 py-1 rounded-full text-white text-sm ${getRiskColor(selectedPolicy.risk)}`}>
                  {selectedPolicy.risk} Risk
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Policy Performance</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Current Value</span>
                        <span className="font-medium">{formatCurrency(selectedPolicy.currentValue)}</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Initial Investment</span>
                        <span className="font-medium">{formatCurrency(selectedPolicy.initialInvestment)}</span>
                      </div>
                      <Progress 
                        value={(selectedPolicy.initialInvestment / selectedPolicy.currentValue) * 100} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Growth</span>
                        <span className={`font-medium ${selectedPolicy.performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(selectedPolicy.currentValue - selectedPolicy.initialInvestment)}
                          <span className="ml-1 text-sm">
                            ({selectedPolicy.performance > 0 ? '+' : ''}{selectedPolicy.performance}%)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Reports & Documentation</h3>
                  
                  <div className="space-y-4">
                    <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
                      <CardContent className="flex items-center p-4">
                        <FileText className="mr-4 text-black" />
                        <div>
                          <h4 className="font-medium">Financial Planning Policy</h4>
                          <p className="text-sm text-gray-500">Complete investment strategy and allocation</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
                      <CardContent className="flex items-center p-4">
                        <FileText className="mr-4 text-black" />
                        <div>
                          <h4 className="font-medium">Policy Update</h4>
                          <p className="text-sm text-gray-500">Latest changes and adjustments</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
                      <CardContent className="flex items-center p-4">
                        <FileText className="mr-4 text-black" />
                        <div>
                          <h4 className="font-medium">Risk Management Report</h4>
                          <p className="text-sm text-gray-500">Stress tests and risk assessments</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PolicyReview;
