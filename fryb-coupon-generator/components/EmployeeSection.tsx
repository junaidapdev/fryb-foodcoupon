"use client";

import React, { useState, useEffect } from "react";
import { Employee } from "@/types";
import { getEmployees, setEmployees } from "@/lib/storage";

export default function EmployeeSection() {
  const [employees, setEmployeesState] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Add Form State
  const [name, setName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editError, setEditError] = useState("");

  // Load on mount & listen to updates
  useEffect(() => {
    setEmployeesState(getEmployees());
    
    const handleUpdate = () => {
      setEmployeesState(getEmployees());
    };
    
    window.addEventListener('employeesUpdated', handleUpdate);
    return () => window.removeEventListener('employeesUpdated', handleUpdate);
  }, []);

  const saveEmployeesData = (newEmployees: Employee[]) => {
    setEmployeesState(newEmployees);
    setEmployees(newEmployees);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !employeeCode.trim()) {
      setError("Name and Employee Code are required.");
      return;
    }

    if (employees.some((emp) => emp.employee_code.toLowerCase() === employeeCode.trim().toLowerCase())) {
      setError("Employee Code already exists.");
      return;
    }

    const newEmployee: Employee = {
      id: crypto.randomUUID(),
      name: name.trim(),
      employee_code: employeeCode.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveEmployeesData([...employees, newEmployee]);
    setSuccess("Employee added successfully.");
    
    setName("");
    setEmployeeCode("");

    setTimeout(() => setSuccess(""), 3000);
  };

  const handleStartEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setEditName(emp.name);
    setEditCode(emp.employee_code);
    setEditError("");
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim() || !editCode.trim()) {
      setEditError("Name and Employee Code are required.");
      return;
    }

    if (
      employees.some(
        (emp) => emp.employee_code.toLowerCase() === editCode.trim().toLowerCase() && emp.id !== id
      )
    ) {
      setEditError("Employee Code already exists.");
      return;
    }

    const updatedEmployees = employees.map((emp) => {
      if (emp.id === id) {
        return {
          ...emp,
          name: editName.trim(),
          employee_code: editCode.trim(),
          updated_at: new Date().toISOString(),
        };
      }
      return emp;
    });

    saveEmployeesData(updatedEmployees);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const updatedEmployees = employees.filter((emp) => emp.id !== id);
      saveEmployeesData(updatedEmployees);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Add Employee Form */}
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-inner">
        <h3 className="text-sm uppercase tracking-wider font-semibold text-gray-500 mb-4">Add New Employee</h3>
        <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="flex flex-col space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div className="flex flex-col space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Code <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="EMP001"
            />
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm transition-colors shadow-sm"
            >
              Add
            </button>
          </div>
        </form>
        {error && <p className="text-red-600 text-sm mt-3 flex items-center"><span className="mr-1">⚠</span> {error}</p>}
        {success && <p className="text-green-600 text-sm mt-3 flex items-center"><span className="mr-1">✓</span> {success}</p>}
      </div>

      {/* Search and Table */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h3 className="text-sm uppercase tracking-wider font-semibold text-gray-500">Employee Directory ({employees.length})</h3>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or code..."
              className="border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 font-semibold w-1/2">Name</th>
                <th className="px-5 py-3 font-semibold w-1/4">Code</th>
                <th className="px-5 py-3 font-semibold text-right w-1/4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-gray-500 bg-gray-50/50">
                    {searchQuery ? "No employees match your search." : "No employees found. Add one above."}
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) =>
                  editingId === emp.id ? (
                    <tr key={emp.id} className="bg-blue-50/50">
                      <td className="px-5 py-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="border border-gray-300 rounded-md px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <input
                          type="text"
                          value={editCode}
                          onChange={(e) => setEditCode(e.target.value)}
                          className="border border-gray-300 rounded-md px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleSaveEdit(emp.id)}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-500 hover:text-gray-700 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                        {editError && <div className="text-red-500 text-xs mt-1 absolute right-5">{editError}</div>}
                      </td>
                    </tr>
                  ) : (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-gray-900 font-medium">{emp.name}</td>
                      <td className="px-5 py-4 text-gray-600 font-mono text-xs">{emp.employee_code}</td>
                      <td className="px-5 py-4 text-right space-x-4">
                        <button
                          onClick={() => handleStartEdit(emp)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
