import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { ProgressBar } from './components/onboarding/ProgressBar';
import { StepDepartment } from './components/onboarding/StepDepartment';
import { StepGrade } from './components/onboarding/StepGrade';
import { StepGPA } from './components/onboarding/StepGPA';
import { StepIncome } from './components/onboarding/StepIncome';
import { StepRegion } from './components/onboarding/StepRegion';
import { LoadingScreen } from './components/onboarding/Loading';
import { HomeFeed } from './components/dashboard/HomeFeed';
import { UserData, Department } from './types';
import { Button } from './components/ui/button';
import { ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'temp_user_data';

export default function App() {
  const [step, setStep] = useState(1); // 1-5: Form, 6: Loading, 7: Result
  const [userData, setUserData] = useState<Partial<UserData>>({});

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserData(parsed);
        // Optional: Resume from where left off? Or just keep data in state.
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }
  }, [userData]);

  const updateData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleDepartmentChange = (dept: Department) => {
    updateData({
      department_id: dept.id,
      department_name: dept.name,
      college: dept.college
    });
  };

  const handleFinish = () => {
    // Check validation if needed
    setStep(6); // Go to loading
  };

  const handleLoadingComplete = () => {
    setStep(7); // Go to result
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserData({});
    setStep(1);
  };

  // Result Page
  if (step === 7) {
    return (
      <div className="bg-surface min-h-screen">
         <Header />
         <HomeFeed userData={userData as UserData} onReset={handleReset} />
      </div>
    );
  }

  // Loading Page
  if (step === 6) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // Form Steps
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 max-w-md mx-auto w-full p-6 flex flex-col">
        <ProgressBar currentStep={step} totalSteps={5} />
        
        <div className="flex-1 flex flex-col">
            {step === 1 && (
              <StepDepartment 
                value={userData.department_id ? { id: userData.department_id, name: userData.department_name!, college: userData.college! } : undefined}
                onChange={handleDepartmentChange}
                onNext={nextStep}
              />
            )}
            {step === 2 && (
              <StepGrade
                grade={userData.grade}
                enrollmentStatus={userData.enrollment_status}
                onChange={updateData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {step === 3 && (
              <StepGPA
                avgGpa={userData.avg_gpa}
                prevSemesterGpa={userData.prev_semester_gpa}
                onChange={updateData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {step === 4 && (
              <StepIncome
                incomeBracket={userData.income_bracket}
                onChange={(val) => updateData({ income_bracket: val })}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {step === 5 && (
              <StepRegion
                region={userData.hometown_region}
                hasDisability={userData.has_disability || false}
                isMultiChild={userData.is_multi_child_family || false}
                isNationalMerit={userData.is_national_merit || false}
                onChange={updateData}
                onSubmit={handleFinish}
                onPrev={prevStep}
              />
            )}
        </div>
      </div>
    </div>
  );
}
