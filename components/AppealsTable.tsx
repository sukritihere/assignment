import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  toggleAppealSelection,
  selectAllAppeals,
  deselectAllAppeals,
  deleteAppeal,
  updateAppeal,
  addAppeal,
  setSearchTerm,
} from "../store/slices/appealsSlice";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Plus,
  Download,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { Appeal } from "../store/slices/appealsSlice";

export default function AppealsTable() {
  const dispatch = useDispatch();
  const { appeals, searchTerm, selectedAppeals } = useSelector(
    (state: RootState) => state.appeals
  );
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Appeal | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAppeal, setNewAppeal] = useState<Omit<Appeal, "id">>({
    taxYear: "",
    company: "",
    state: "",
    assessor: "",
    account: "",
    appealedDate: "",
  });

  const filteredAppeals = appeals.filter(
    (appeal) =>
      appeal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appeal.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appeal.assessor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appeal.account.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAppeals = [...filteredAppeals].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key as keyof Appeal] ?? "";
    const bValue = b[sortConfig.key as keyof Appeal] ?? "";

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleEdit = (appeal: Appeal) => {
    setEditingId(appeal.id);
    setEditForm(appeal);
  };

  const handleSave = () => {
    if (editForm) {
      dispatch(updateAppeal(editForm));
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleAdd = () => {
    dispatch(addAppeal(newAppeal));
    setNewAppeal({
      taxYear: "",
      company: "",
      state: "",
      assessor: "",
      account: "",
      appealedDate: "",
    });
    setShowAddForm(false);
  };

  const handleSelectAll = () => {
    if (selectedAppeals.length === appeals.length) {
      dispatch(deselectAllAppeals());
    } else {
      dispatch(selectAllAppeals());
    }
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Tax Year,Company,State,Assessor,Account,Appealed Date\n" +
      selectedAppeals
        .map((id) => {
          const appeal = appeals.find((a) => a.id === id);
          return appeal
            ? `${appeal.taxYear},${appeal.company},${appeal.state},${appeal.assessor},${appeal.account},${appeal.appealedDate}`
            : "";
        })
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "appeals_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    const pdfContent = `Appeals Letter\n\nSelected Appeals:\n${selectedAppeals
      .map((id) => {
        const appeal = appeals.find((a) => a.id === id);
        return appeal ? `${appeal.taxYear} - ${appeal.company}` : "";
      })
      .join("\n")}`;

    const blob = new Blob([pdfContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "appeals_letter.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        <div className="flex flex-col pl-4">
          <h1 className="text-xl font-semibold text-gray-900 py-3">
            Appeal Letter
          </h1>
          <div className="h-1 bg-teal-500 w-full rounded-lg" />
        </div>

        <div className="flex items-center space-x-3">
          <span className="bg-red-400 text-white px-3 py-1 rounded-lg text-xs font-medium">
            {appeals.length}
          </span>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-white px-6 py-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-end gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Property, Jurisdiction, Parcel Number or Client"
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-400 text-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 btn-border-custom rounded-lg">
                <BarChart3 className="w-4 h-4" />
              </button>
              <button className="p-2 bg-gray-200 hover:text-gray-700 rounded-full">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-6 gap-4">
              <input
                type="text"
                placeholder="Tax Year"
                value={newAppeal.taxYear}
                onChange={(e) =>
                  setNewAppeal({ ...newAppeal, taxYear: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Company"
                value={newAppeal.company}
                onChange={(e) =>
                  setNewAppeal({ ...newAppeal, company: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="State"
                value={newAppeal.state}
                onChange={(e) =>
                  setNewAppeal({ ...newAppeal, state: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Assessor"
                value={newAppeal.assessor}
                onChange={(e) =>
                  setNewAppeal({ ...newAppeal, assessor: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Account"
                value={newAppeal.account}
                onChange={(e) =>
                  setNewAppeal({ ...newAppeal, account: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                placeholder="Appealed Date"
                value={newAppeal.appealedDate}
                onChange={(e) =>
                  setNewAppeal({ ...newAppeal, appealedDate: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Appeal
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white overflow-x-auto">
          <table className="min-w-[768px] w-full">
            <div className="px-2 ">
              <thead className="bg-[#ECF3F9] border-b border-[#E2E6EF]">
                <tr>
                  <th className="px-6 py-4 text-left w-12 ">
                    <input
                      type="checkbox"
                      checked={selectedAppeals.length === appeals.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                    />
                  </th>
                  {[
                    { key: "taxYear", label: "TAX YEAR" },
                    { key: "company", label: "COMPANY" },
                    { key: "state", label: "STATE" },
                    { key: "assessor", label: "ASSESSOR" },
                    { key: "account", label: "ACCOUNT NUMBER" },
                    { key: "appealedDate", label: "APPEALED DATE" },
                  ].map((column) => (
                    <th
                      key={column.key}
                      className="px-2 py-5 text-left text-xs text-gray-500 font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {sortConfig?.key === column.key &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAppeals.map((appeal) => (
                  <tr
                    key={appeal.id}
                    className={`hover:bg-gray-50 ${
                      selectedAppeals.includes(appeal.id) ? "bg-gray-100" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedAppeals.includes(appeal.id)}
                        onChange={() =>
                          dispatch(toggleAppealSelection(appeal.id))
                        }
                        className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                        style={{
                          accentColor: selectedAppeals.includes(appeal.id)
                            ? "#ef4444"
                            : undefined,
                        }}
                      />
                    </td>
                    {editingId === appeal.id ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={editForm?.taxYear || ""}
                            onChange={(e) =>
                              setEditForm((prev) =>
                                prev
                                  ? { ...prev, taxYear: e.target.value }
                                  : null
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={editForm?.company || ""}
                            onChange={(e) =>
                              setEditForm((prev) =>
                                prev
                                  ? { ...prev, company: e.target.value }
                                  : null
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={editForm?.state || ""}
                            onChange={(e) =>
                              setEditForm((prev) =>
                                prev ? { ...prev, state: e.target.value } : null
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={editForm?.assessor || ""}
                            onChange={(e) =>
                              setEditForm((prev) =>
                                prev
                                  ? { ...prev, assessor: e.target.value }
                                  : null
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={editForm?.account || ""}
                            onChange={(e) =>
                              setEditForm((prev) =>
                                prev
                                  ? { ...prev, account: e.target.value }
                                  : null
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="date"
                            value={editForm?.appealedDate || ""}
                            onChange={(e) =>
                              setEditForm((prev) =>
                                prev
                                  ? { ...prev, appealedDate: e.target.value }
                                  : null
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg"
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {appeal.taxYear}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appeal.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appeal.state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appeal.assessor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appeal.account}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appeal.appealedDate}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingId === appeal.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 hover:text-gray-900 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(appeal)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => dispatch(deleteAppeal(appeal.id))}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </div>
          </table>
        </div>

        <div className="bg-[#F8F9FB] px-4 py-3 border-t border-gray-200 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-y-3 lg:gap-y-0 text-xs">
            <div className="text-gray-500 text-center lg:text-left">
              1–10 of 120
            </div>
            <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-1">
              <button className="px-2 py-1 border border-gray-300 bg-white rounded hover:bg-gray-50 text-gray-600 flex items-center">
                <ChevronLeft className="w-4 h-4" />
                <span className="ml-1 hidden sm:inline">Previous</span>
              </button>
              {[1, 2, 3, "...", 8, 9, 10].map((page, idx) => (
                <button
                  key={idx}
                  className={`px-2 py-1 rounded border text-xs ${
                    page === 1
                      ? "bg-white border-gray-300 text-gray-800 font-medium shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-2 py-1 border border-gray-300 bg-white rounded hover:bg-gray-50 text-gray-600 flex items-center">
                <span className="mr-1 hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="hidden lg:flex items-center gap-1 justify-end">
              <span className="text-gray-600">Go on to</span>
              <input
                type="number"
                defaultValue={10}
                className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        {!showAddForm && (
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-teal text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Appeal</span>
            </button>
          </div>
        )}
        {selectedAppeals.length > 0 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 w-[95%] sm:w-[100%] md:w-[90%] lg:w-[700px] xl:w-[768px] 2xl:w-[800px] bg-[#EEF6FB] px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 shadow-xl rounded-xl btn-border-custom">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
              <div className="text-sm md:text-sm lg:text-md font-medium text-[#1C2D41]">
                {selectedAppeals.length} Appeal Letter selected
              </div>
              <div className="flex flex-wrap items-center justify-end gap-1 md:gap-3 w-full sm:w-auto">
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center gap-1 lg:gap-2 btn-border-custom text-[#20BFAA] px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-[#f7fdfc] transition-colors text-xs sm:text-sm md:text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden lg:inline">Export Grid Details</span>
                  <span className="hidden sm:inline lg:hidden">
                    Export Grid
                  </span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 btn-border-custom text-[#20BFAA] px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 rounded-lg  hover:bg-[#f7fdfc] transition-colors text-xs sm:text-sm md:text-sm font-medium"
                >
                  <Download className="w-4 h-4 rotate-180" />
                  <span className="hidden lg:inline">Download Letter</span>
                  <span className="hidden md:inline lg:hidden">Download</span>
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#43C6B5] text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-[#38b1a2] transition-colors text-xs sm:text-sm md:text-sm font-medium">
                  <span className="hidden sm:inline md:hidden">Status</span>
                  <span className="hidden md:inline">Change Status</span>
                  <span className="inline sm:hidden">✔️</span>
                </button>
                <button
                  onClick={() => dispatch(deselectAllAppeals())}
                  className="ml-auto text-[#1C2D41] text-base sm:text-lg hover:text-red-500"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
