// import { DataTable, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
// import './index.css'
// import { Column } from 'primereact/column';
// import { Sidebar } from 'primereact/sidebar';
// import { useEffect, useRef, useState } from 'react';
// import { getCallDetails, getCallHistory } from '../../common/api';
// import { Toast } from 'primereact/toast';
// import { useNavigate } from 'react-router-dom';
// import { pagePaths } from '../../common/constants';
// import { MoonLoader, ScaleLoader } from 'react-spinners';
// import ConversationEval from '../../components/conversation-eval';
// import EntityExtraction from '../../components/entity-extraction';
// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';
// import { Calendar } from 'primereact/calendar';
// import { Dropdown } from 'primereact/dropdown';

// interface HistoryProps {
//   // Add any props here if needed - currently none are required
// }

// interface CallRecord {
//     id?: string;
//     Name: {
//         name: string;
//     };
//     End_time: string;
//     duration_ms: string;
//     direction: string;
//     from_number: string;
//     to_number: string;
//     call_status: string;
//     recording_api: string;
//     call_type: string;
//     [key: string]: any;
// }

// const History: React.FC<HistoryProps> = () => {
//     const navigate = useNavigate();
//     const toast = useRef<Toast>(null);

//     const show = (summary: string, severity: 'error' | 'info' | 'success' = 'error') => {
//         toast.current?.show({ severity, summary, life: 3000 });
//     };

//     const [visible, setVisible] = useState<boolean>(false);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [list, setList] = useState<CallRecord[]>([]);
//     const [filteredList, setFilteredList] = useState<CallRecord[]>([]);
    
//     // Audio states - but with error handling
//     const [audioLoading, setAudioLoading] = useState<boolean>(false);
//     const [audioSrc, setAudioSrc] = useState<string|undefined>();
//     const [audioError, setAudioError] = useState<string | null>(null);
    
//     const [sideBarData, setSideBarData] = useState<any>();
//     const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
//     const [conversationEval, setConversationEval] = useState<any>(null);
//     const [entityData, setEntityData] = useState<any>(null);
    
//     // Filter states
//     const [selectedRecords, setSelectedRecords] = useState<CallRecord[]>([]);
//     const [showFilters, setShowFilters] = useState<boolean>(false);
//     const [searchText, setSearchText] = useState<string>('');
//     const [startDate, setStartDate] = useState<Date | null>(null);
//     const [endDate, setEndDate] = useState<Date | null>(null);
//     const [selectedStatus, setSelectedStatus] = useState<string>('');
//     const [selectedDirection, setSelectedDirection] = useState<string>('');

//     // Filter options
//     const statusOptions = [
//         { label: 'All Status', value: '' },
//         { label: 'Completed', value: 'completed' },
//         { label: 'Failed', value: 'failed' },
//         { label: 'In Progress', value: 'in-progress' },
//         { label: 'Busy', value: 'busy' },
//         { label: 'No Answer', value: 'no-answer' }
//     ];

//     const directionOptions = [
//         { label: 'All Types', value: '' },
//         { label: 'Inbound', value: 'inbound' },
//         { label: 'Outbound', value: 'outbound' }
//     ];

//     // Modified audio fetching with graceful error handling
//     useEffect(() => {
//         const fetchAudioStream = async () => {
//             if (!sideBarData?.recording_api) {
//                 setAudioError("No recording URL available");
//                 return;
//             }

//             try {
//                 setAudioLoading(true);
//                 setAudioError(null);
                
//                 const url: string = sideBarData.recording_api;   
//                 const response = await fetch(url);
                
//                 if (!response.ok) {
//                     // Handle different error types
//                     if (response.status === 404) {
//                         setAudioError("Audio recording not found for this call");
//                     } else if (response.status === 403) {
//                         setAudioError("Access denied to audio recording");
//                     } else {
//                         setAudioError(`Audio not available (Error: ${response.status})`);
//                     }
//                     return;
//                 }

//                 const audioBlob = await response.blob();
                
//                 // Check if the blob is actually audio content
//                 if (audioBlob.size === 0) {
//                     setAudioError("Audio recording is empty");
//                     return;
//                 }
                
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 setAudioSrc(audioUrl);
//                 setAudioError(null);
                
//             } catch (error) {
//                 console.error("Error streaming audio:", error);
//                 setAudioError("Unable to load audio recording");
//             } finally {
//                 setAudioLoading(false);
//             }
//         };

//         if (sideBarData?.recording_api) {
//             fetchAudioStream();
//         } else {
//             setAudioError("No recording available for this call");
//             setAudioSrc(undefined);
//         }

//         return () => {
//             if (audioSrc) {
//                 URL.revokeObjectURL(audioSrc);
//                 setAudioSrc(undefined);
//             }
//         };
//     }, [sideBarData]);

//     // Apply filters when filter criteria change
//     useEffect(() => {
//         let filtered = [...list];

//         // Text search filter
//         if (searchText) {
//             filtered = filtered.filter(record => 
//                 record.Name?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
//                 record.from_number?.includes(searchText) ||
//                 record.to_number?.includes(searchText)
//             );
//         }

//         // Date range filter
//         if (startDate || endDate) {
//             filtered = filtered.filter(record => {
//                 const recordDate = new Date(record.End_time);
//                 if (startDate && recordDate < startDate) return false;
//                 if (endDate && recordDate > endDate) return false;
//                 return true;
//             });
//         }

//         // Status filter
//         if (selectedStatus) {
//             filtered = filtered.filter(record => 
//                 record.call_status?.toLowerCase() === selectedStatus.toLowerCase()
//             );
//         }

//         // Direction filter
//         if (selectedDirection) {
//             filtered = filtered.filter(record => 
//                 record.direction?.toLowerCase() === selectedDirection.toLowerCase()
//             );
//         }

//         setFilteredList(filtered);
//     }, [list, searchText, startDate, endDate, selectedStatus, selectedDirection]);

//     function formatDuration(seconds: number) {
//         const minutes = Math.floor(seconds / 60);
//         const remainingSeconds = seconds % 60;
//         return `${minutes}m ${remainingSeconds}s`;
//     }

//     function formatDurationMillis(milliseconds: number) {
//         const totalSeconds = Math.floor(milliseconds / 1000);
//         return formatDuration(totalSeconds);
//     }

//     const dateTime = (input: number) => {
//         const date = new Date(input);
//         return date.toLocaleString();
//     }

//     useEffect(() => {
//         const user_id = localStorage.getItem("fullName")
//         if (user_id == null) {
//             show("please login first");
//             navigate(pagePaths.signin);
//         } else {
//             setLoading(true);
//             getCallHistory(user_id).then(data => {
//                 // Updated mapping to match the new API response structure
//                 const res = data.data.map((record: CallRecord, index: number) => ({
//                     ...record,
//                     id: `call_${index}`, // Add unique ID for selection
//                     name: record.Name?.name || 'Unknown', // Extract name from Name object
//                     duration_ms: formatDurationMillis(Number(record.duration_ms) || 0),
//                     End_time: dateTime(Number(record.End_time) || Date.now())
//                 }));
//                 setList(res);
//             }).catch((error) => {
//                 console.error("Error fetching call history:", error);
//                 show("Error fetching call history");
//             }).finally(() => {
//                 setLoading(false);
//             });
//         }
//     }, []);

//     const open = async (rowData: any) => {
//         // Set sidebar data with available information
//         setSideBarData({
//             recording_api: rowData.recording_api
//         });
        
//         // Reset states
//         setConversationEval(null);
//         setEntityData(null);
//         setAudioError(null);
//         setAudioSrc(undefined);
//         setVisible(true);
        
//         // Extract conversation_id from the recording_api URL
//         let conversationId = null;
//         if (rowData.recording_api) {
//             const urlParts = rowData.recording_api.split('/');
//             conversationId = urlParts[urlParts.length - 1];
//             console.log("Extracted conversation ID:", conversationId);
//         }
        
//         // Fetch call details to get transcript, summary, eval, and entity data
//         if (conversationId) {
//             try {
//                 const user_id = localStorage.getItem("fullName");
//                 if (user_id) {
//                     setDetailsLoading(true);
//                     const response = await getCallDetails(user_id, conversationId);
                    
//                     console.log("API Response:", response.data); // Debug log
                    
//                     if (response.status <= 299 && response.data) {
//                         const callDetails = response.data;
                        
//                         // Process conversation eval data - wrap in result object
//                         if (callDetails.conversation_eval) {
//                             console.log("Setting conversation eval:", callDetails.conversation_eval);
//                             setConversationEval({ result: callDetails.conversation_eval });
//                         } else {
//                             setConversationEval(null);
//                         }
                        
//                         // Process entity data - transform to expected format
//                         if (callDetails.entity) {
//                             console.log("Setting entity data:", callDetails.entity);
//                             const transformedEntity: any = {};
//                             Object.keys(callDetails.entity).forEach(key => {
//                                 const entityValue = callDetails.entity[key];
//                                 if (typeof entityValue === 'object' && entityValue !== null) {
//                                     // For nested objects like lead_info, create a formatted display with line breaks
//                                     const formattedEntries = Object.entries(entityValue).map(([nestedKey, nestedValue]) => {
//                                         // Format the key to be more readable
//                                         const readableKey = nestedKey
//                                             .replace(/_/g, ' ')
//                                             .replace(/\b\w/g, l => l.toUpperCase());
//                                         return `${readableKey}: ${nestedValue}`;
//                                     });
                                    
//                                     transformedEntity[key] = {
//                                         value: formattedEntries.join('\n'),
//                                         text: "Extracted from conversation",
//                                         confidence: "high"
//                                     };
//                                 } else {
//                                     // For simple values
//                                     transformedEntity[key] = {
//                                         value: String(entityValue),
//                                         text: "Extracted from conversation", 
//                                         confidence: "high"
//                                     };
//                                 }
//                             });
//                             setEntityData(transformedEntity);
//                         } else {
//                             setEntityData(null);
//                         }
                        
//                         // Update sidebar data with transcript and summary
//                         setSideBarData((prev: any) => ({
//                             ...prev,
//                             transcript: callDetails.transcript || "Transcript not available",
//                             summary: callDetails.summary || "Summary not available"
//                         }));
//                     } else {
//                         setConversationEval(null);
//                         setEntityData(null);
//                         setSideBarData((prev: any) => ({
//                             ...prev,
//                             transcript: "Transcript not available",
//                             summary: "Summary not available"
//                         }));
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error fetching call details:", error);
//                 show("Error fetching call details", "info");
//                 setConversationEval(null);
//                 setEntityData(null);
//                 setSideBarData((prev: any) => ({
//                     ...prev,
//                     transcript: "Error loading transcript",
//                     summary: "Error loading summary"
//                 }));
//             } finally {
//                 setDetailsLoading(false);
//             }
//         }
//     };

//     const lockTemplate = (rowData: any) => {
//         return (
//             <span className='view' onClick={() => open(rowData)}>
//                 View Details
//                 <i className="pi pi-arrow-up-right"></i>
//             </span>
//         );
//     };

//     // Clear all filters
//     const clearFilters = () => {
//         setSearchText('');
//         setStartDate(null);
//         setEndDate(null);
//         setSelectedStatus('');
//         setSelectedDirection('');
//         setSelectedRecords([]);
//     };

//     // Toggle filters visibility
//     const toggleFilters = () => {
//         setShowFilters(!showFilters);
//     };

//     // Convert data to CSV format
//     const convertToCSV = (data: any[]) => {
//         const headers = ['Name', 'Time', 'Duration', 'Type', 'From', 'To', 'Call Status'];
//         const csvContent = [
//             headers.join(','),
//             ...data.map(record => [
//                 `"${record.name || record.Name?.name || ''}"`,
//                 `"${record.End_time || ''}"`,
//                 `"${record.duration_ms || ''}"`,
//                 `"${record.direction || ''}"`,
//                 `"${record.from_number || ''}"`,
//                 `"${record.to_number || ''}"`,
//                 `"${record.call_status || ''}"`
//             ].join(','))
//         ].join('\n');
        
//         return csvContent;
//     };

//     // Download CSV
//     const downloadCSV = () => {
//         const dataToExport = selectedRecords.length > 0 ? selectedRecords : filteredList;
        
//         if (dataToExport.length === 0) {
//             show("No data to export", "info");
//             return;
//         }

//         const csvContent = convertToCSV(dataToExport);
//         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//         const link = document.createElement('a');
        
//         if (link.download !== undefined) {
//             const url = URL.createObjectURL(blob);
//             link.setAttribute('href', url);
//             link.setAttribute('download', `call_history_${new Date().toISOString().split('T')[0]}.csv`);
//             link.style.visibility = 'hidden';
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         }
        
//         show(`Exported ${dataToExport.length} records`, "success");
//     };

//     const header = (
//         <div className="table-header">
//             <div className="header-top">
//                 <div className="header-actions">
//                     <Button
//                         label="Filters"
//                         icon={showFilters ? "pi pi-filter-slash" : "pi pi-filter"}
//                         onClick={toggleFilters}
//                         className="filter-toggle-btn"
//                         size="small"
//                         outlined
//                     />
                    
//                     {(searchText || startDate || endDate || selectedStatus || selectedDirection) && (
//                         <Button
//                             label="Clear All"
//                             icon="pi pi-times"
//                             onClick={clearFilters}
//                             className="clear-all-btn"
//                             size="small"
//                             severity="secondary"
//                             outlined
//                         />
//                     )}
//                 </div>
                
//                 <div className="selection-info">
//                     {selectedRecords.length > 0 && (
//                         <span className="selected-count">
//                             {selectedRecords.length} selected
//                         </span>
//                     )}
//                     <span className="total-count">
//                         Showing {filteredList.length} of {list.length} records
//                     </span>
//                 </div>
                
//                 <Button
//                     label={selectedRecords.length > 0 ? `Download Selected (${selectedRecords.length})` : `Download All (${filteredList.length})`}
//                     icon="pi pi-download"
//                     onClick={downloadCSV}
//                     className="download-btn"
//                     disabled={filteredList.length === 0}
//                 />
//             </div>
            
//             {showFilters && (
//                 <div className="filter-section">
//                     <div className="filter-row">
//                         <div className="filter-item">
//                             <label>Search:</label>
//                             <InputText
//                                 value={searchText}
//                                 onChange={(e) => setSearchText(e.target.value)}
//                                 placeholder="Search by name or number..."
//                                 className="search-input"
//                             />
//                         </div>
                        
//                         <div className="filter-item">
//                             <label>From Date:</label>
//                             <Calendar
//                                 value={startDate}
//                                 onChange={(e) => setStartDate(e.value as Date)}
//                                 placeholder="Start date"
//                                 dateFormat="dd/mm/yy"
//                                 showIcon
//                             />
//                         </div>
                        
//                         <div className="filter-item">
//                             <label>To Date:</label>
//                             <Calendar
//                                 value={endDate}
//                                 onChange={(e) => setEndDate(e.value as Date)}
//                                 placeholder="End date"
//                                 dateFormat="dd/mm/yy"
//                                 showIcon
//                             />
//                         </div>
//                     </div>
                    
//                     <div className="filter-row">
//                         <div className="filter-item">
//                             <label>Status:</label>
//                             <Dropdown
//                                 value={selectedStatus}
//                                 options={statusOptions}
//                                 onChange={(e) => setSelectedStatus(e.value)}
//                                 placeholder="Select status"
//                                 className="status-dropdown"
//                             />
//                         </div>
                        
//                         <div className="filter-item">
//                             <label>Type:</label>
//                             <Dropdown
//                                 value={selectedDirection}
//                                 options={directionOptions}
//                                 onChange={(e) => setSelectedDirection(e.value)}
//                                 placeholder="Select type"
//                                 className="direction-dropdown"
//                             />
//                         </div>
                        
//                         <div className="filter-spacer"></div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );

//     return (
//         <div className="history">
//             <Toast ref={toast} position="bottom-right" />
//             <div className="card">
//                 <DataTable 
//                     value={filteredList} 
//                     tableStyle={{ minWidth: '80rem', maxHeight: '100rem', fontSize: '1.5rem' }} 
//                     size='large' 
//                     resizableColumns 
//                     scrollable 
//                     scrollHeight='65vh'
//                     header={header}
//                     selection={selectedRecords}
//                     onSelectionChange={(e: DataTableSelectionMultipleChangeEvent<CallRecord[]>) => setSelectedRecords(e.value || [])}
//                     dataKey="id"
//                     selectionMode="checkbox"
//                     paginator
//                     rows={10}
//                     rowsPerPageOptions={[5, 10, 25, 50]}
//                     paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
//                     currentPageReportTemplate="{first} to {last} of {totalRecords}"
//                 >
//                     <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
//                     <Column field="name" header="Name" sortable></Column>
//                     <Column header="Time" field="End_time" sortable></Column>
//                     <Column header="Duration" field="duration_ms" sortable></Column>
//                     <Column header="Type" field="direction" sortable></Column>
//                     <Column header="From" field="from_number" sortable></Column>
//                     <Column header="To" field="to_number" sortable></Column>
//                     <Column header="Call Status" field="call_status" sortable></Column>
//                     <Column body={lockTemplate} header="Details"></Column>
//                 </DataTable>
//             </div>
            
//             <Sidebar 
//                 visible={visible} 
//                 onHide={() => setVisible(false)}
//                 position='right'
//                 className='sidebar'
//             > 
//                 <h2>Call Details</h2>
//                 <div className='sidebar-text'>
//                     {/* Audio Section - with graceful error handling */}
//                     <div className='audio-section'>
//                         <h3>Recording</h3>
//                         {audioLoading && (
//                             <div className="audio-loading">
//                                 <ScaleLoader height={20} width={2} radius={5} margin={2} color="#979797" />
//                                 <p>Loading audio...</p>
//                             </div>
//                         )}
                        
//                         {audioError && (
//                             <div className="audio-error">
//                                 <i className="pi pi-exclamation-triangle" style={{color: '#ff9800', marginRight: '8px'}}></i>
//                                 <span style={{color: '#666', fontStyle: 'italic'}}>{audioError}</span>
//                             </div>
//                         )}
                        
//                         {audioSrc && !audioError && (
//                             <audio crossOrigin='anonymous' controls src={audioSrc} style={{width: '100%'}}></audio>
//                         )}
//                     </div>
                    
//                     {/* Content loads after API call */}
//                     {detailsLoading ? (
//                         <div className="details-loading">
//                             <ScaleLoader height={20} width={2} radius={5} margin={2} color="#979797" />
//                         </div>
//                     ) : (
//                         <>
//                             {/* Transcript Section */}
//                             <div className='transcript'>
//                                 <h3>Transcript</h3>
//                                 <p>
//                                     <pre>{sideBarData?.transcript || "Loading transcript..."}</pre>  
//                                 </p>
//                             </div>
                            
//                             {/* Summary Section */}
//                             <div className='summary'>
//                                 <h3>Summary</h3>
//                                 <p>
//                                     {sideBarData?.summary || "Loading summary..."}
//                                 </p>
//                             </div>
                            
//                             {/* Conversation Evaluation */}
//                             <ConversationEval evalData={conversationEval} />
                            
//                             {/* Entity Extraction */}
//                             <EntityExtraction entities={entityData} />
//                         </>
//                     )}
//                 </div>
//             </Sidebar>

//             {loading && (
//                 <div className="loader-overlay">
//                     <MoonLoader size={50} color="black" />
//                 </div>
//             )}
//         </div> 
//     );
// };

// export default History;


import { DataTable, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import './index.css'
import { Column } from 'primereact/column';
import { Sidebar } from 'primereact/sidebar';
import { useEffect, useRef, useState } from 'react';
import { getCallDetails, getCallHistory } from '../../common/api';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { pagePaths } from '../../common/constants';
import { MoonLoader, ScaleLoader } from 'react-spinners';
import ConversationEval from '../../components/conversation-eval';
import EntityExtraction from '../../components/entity-extraction';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

interface HistoryProps {
  // Add any props here if needed - currently none are required
}

interface CallRecord {
    id?: string;
    Name: {
        name: string;
    };
    End_time: string;
    duration_ms: string;
    direction: string;
    from_number: string;
    to_number: string;
    call_status: string;
    recording_api: string;
    call_type: string;
    [key: string]: any;
}

const History: React.FC<HistoryProps> = () => {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    const show = (summary: string, severity: 'error' | 'info' | 'success' = 'error') => {
        toast.current?.show({ severity, summary, life: 3000 });
    };

    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [list, setList] = useState<CallRecord[]>([]);
    const [filteredList, setFilteredList] = useState<CallRecord[]>([]);
    
    // Audio states - but with error handling
    const [audioLoading, setAudioLoading] = useState<boolean>(false);
    const [audioSrc, setAudioSrc] = useState<string|undefined>();
    const [audioError, setAudioError] = useState<string | null>(null);
    
    const [sideBarData, setSideBarData] = useState<any>();
    const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
    const [conversationEval, setConversationEval] = useState<any>(null);
    const [entityData, setEntityData] = useState<any>(null);
    
    // Filter states
    const [selectedRecords, setSelectedRecords] = useState<CallRecord[]>([]);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedDirection, setSelectedDirection] = useState<string>('');

    // Filter options
    const statusOptions = [
        { label: 'All Status', value: '' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Busy', value: 'busy' },
        { label: 'No Answer', value: 'no-answer' }
    ];

    const directionOptions = [
        { label: 'All Types', value: '' },
        { label: 'Inbound', value: 'inbound' },
        { label: 'Outbound', value: 'outbound' }
    ];

    // Modified audio fetching with graceful error handling
    useEffect(() => {
        const fetchAudioStream = async () => {
            if (!sideBarData?.recording_api) {
                setAudioError("No recording URL available");
                return;
            }

            try {
                setAudioLoading(true);
                setAudioError(null);
                
                const url: string = sideBarData.recording_api;   
                const response = await fetch(url);
                
                if (!response.ok) {
                    // Handle different error types
                    if (response.status === 404) {
                        setAudioError("Audio recording not found for this call");
                    } else if (response.status === 403) {
                        setAudioError("Access denied to audio recording");
                    } else {
                        setAudioError(`Audio not available (Error: ${response.status})`);
                    }
                    return;
                }

                const audioBlob = await response.blob();
                
                // Check if the blob is actually audio content
                if (audioBlob.size === 0) {
                    setAudioError("Audio recording is empty");
                    return;
                }
                
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioSrc(audioUrl);
                setAudioError(null);
                
            } catch (error) {
                console.error("Error streaming audio:", error);
                setAudioError("Unable to load audio recording");
            } finally {
                setAudioLoading(false);
            }
        };

        if (sideBarData?.recording_api) {
            fetchAudioStream();
        } else {
            setAudioError("No recording available for this call");
            setAudioSrc(undefined);
        }

        return () => {
            if (audioSrc) {
                URL.revokeObjectURL(audioSrc);
                setAudioSrc(undefined);
            }
        };
    }, [sideBarData]);

    // Apply filters when filter criteria change
    useEffect(() => {
        let filtered = [...list];

        // Text search filter
        if (searchText) {
            filtered = filtered.filter(record => 
                record.Name?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                record.from_number?.includes(searchText) ||
                record.to_number?.includes(searchText)
            );
        }

        // Date range filter
        if (startDate || endDate) {
            filtered = filtered.filter(record => {
                const recordDate = new Date(record.End_time);
                if (startDate && recordDate < startDate) return false;
                if (endDate && recordDate > endDate) return false;
                return true;
            });
        }

        // Status filter
        if (selectedStatus) {
            filtered = filtered.filter(record => 
                record.call_status?.toLowerCase() === selectedStatus.toLowerCase()
            );
        }

        // Direction filter
        if (selectedDirection) {
            filtered = filtered.filter(record => 
                record.direction?.toLowerCase() === selectedDirection.toLowerCase()
            );
        }

        setFilteredList(filtered);
    }, [list, searchText, startDate, endDate, selectedStatus, selectedDirection]);

    function formatDuration(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    function formatDurationMillis(milliseconds: number) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        return formatDuration(totalSeconds);
    }

    const dateTime = (input: number) => {
        const date = new Date(input);
        return date.toLocaleString();
    }

    useEffect(() => {
        const user_id = localStorage.getItem("fullName")
        if (user_id == null) {
            show("please login first");
            navigate(pagePaths.signin);
        } else {
            setLoading(true);
            getCallHistory(user_id).then(data => {
                // Updated mapping to match the new API response structure
                const res = data.data.map((record: CallRecord, index: number) => ({
                    ...record,
                    id: `call_${index}`, // Add unique ID for selection
                    name: record.Name?.name || 'Unknown', // Extract name from Name object
                    duration_ms: formatDurationMillis(Number(record.duration_ms) || 0),
                    End_time: dateTime(Number(record.End_time) || Date.now())
                }));
                setList(res);
            }).catch((error) => {
                console.error("Error fetching call history:", error);
                show("Error fetching call history");
            }).finally(() => {
                setLoading(false);
            });
        }
    }, []);

    const open = async (rowData: any) => {
        // Set sidebar data with available information
        setSideBarData({
            recording_api: rowData.recording_api
        });
        
        // Reset states
        setConversationEval(null);
        setEntityData(null);
        setAudioError(null);
        setAudioSrc(undefined);
        setVisible(true);
        
        // Extract conversation_id from the recording_api URL
        let conversationId = null;
        if (rowData.recording_api) {
            const urlParts = rowData.recording_api.split('/');
            conversationId = urlParts[urlParts.length - 1];
            console.log("Extracted conversation ID:", conversationId);
        }
        
        // Fetch call details to get transcript, summary, eval, and entity data
        if (conversationId) {
            try {
                const user_id = localStorage.getItem("fullName");
                if (user_id) {
                    setDetailsLoading(true);
                    const response = await getCallDetails(user_id, conversationId);
                    
                    console.log("API Response:", response.data); // Debug log
                    
                    if (response.status <= 299 && response.data) {
                        const callDetails = response.data;
                        
                        // Process conversation eval data - check if it exists and has content
                        if (callDetails.conversation_eval && 
                            typeof callDetails.conversation_eval === 'object' && 
                            Object.keys(callDetails.conversation_eval).length > 0) {
                            console.log("Setting conversation eval:", callDetails.conversation_eval);
                            setConversationEval({ result: callDetails.conversation_eval });
                        } else {
                            setConversationEval(null);
                        }
                        
                        // Process entity data - check if it exists and has content
                        if (callDetails.entity && 
                            typeof callDetails.entity === 'object' && 
                            Object.keys(callDetails.entity).length > 0) {
                            console.log("Setting entity data:", callDetails.entity);
                            const transformedEntity: any = {};
                            Object.keys(callDetails.entity).forEach(key => {
                                const entityValue = callDetails.entity[key];
                                if (typeof entityValue === 'object' && entityValue !== null) {
                                    // For nested objects like lead_info, create individual entries for better readability
                                    Object.entries(entityValue).forEach(([nestedKey, nestedValue]) => {
                                        // Format the key to be more readable
                                        const readableKey = nestedKey
                                            .replace(/_/g, ' ')
                                            .replace(/\b\w/g, l => l.toUpperCase());
                                        
                                        // Determine confidence level based on value
                                        let confidence = "high";
                                        if (nestedKey.includes('confidence') && typeof nestedValue === 'number') {
                                            if (nestedValue >= 0.9) {
                                                confidence = "high";
                                            } else if (nestedValue >= 0.75) {
                                                confidence = "medium";
                                            } else {
                                                confidence = "low";
                                            }
                                        }
                                        
                                        // Special handling for lead_strength colors
                                        if (nestedKey === 'lead_strength') {
                                            if (nestedValue === 'junk') {
                                                confidence = "low"; // Will show as red
                                            } else if (nestedValue === 'callback') {
                                                confidence = "medium"; // Will show as yellow
                                            } else if (nestedValue === 'warm') {
                                                confidence = "high"; // Will show as green
                                            }
                                        }
                                        
                                        // Create separate entry for each nested property
                                        transformedEntity[readableKey] = {
                                            value: String(nestedValue),
                                            text: "", // Remove the "From transcript" line
                                            confidence: confidence
                                        };
                                    });
                                } else {
                                    // For simple values
                                    const readableKey = key
                                        .replace(/_/g, ' ')
                                        .replace(/\b\w/g, l => l.toUpperCase());
                                    transformedEntity[readableKey] = {
                                        value: String(entityValue),
                                        text: "", // Remove the "From transcript" line
                                        confidence: "high"
                                    };
                                }
                            });
                            setEntityData(transformedEntity);
                        } else {
                            setEntityData(null);
                        }
                        
                        // Update sidebar data with transcript and summary
                        setSideBarData((prev: any) => ({
                            ...prev,
                            transcript: callDetails.transcript || "Transcript not available",
                            summary: callDetails.summary || "Summary not available"
                        }));
                    } else {
                        setConversationEval(null);
                        setEntityData(null);
                        setSideBarData((prev: any) => ({
                            ...prev,
                            transcript: "Transcript not available",
                            summary: "Summary not available"
                        }));
                    }
                }
            } catch (error) {
                console.error("Error fetching call details:", error);
                show("Error fetching call details", "info");
                setConversationEval(null);
                setEntityData(null);
                setSideBarData((prev: any) => ({
                    ...prev,
                    transcript: "Error loading transcript",
                    summary: "Error loading summary"
                }));
            } finally {
                setDetailsLoading(false);
            }
        }
    };

    const lockTemplate = (rowData: any) => {
        return (
            <span className='view' onClick={() => open(rowData)}>
                View Details
                <i className="pi pi-arrow-up-right"></i>
            </span>
        );
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchText('');
        setStartDate(null);
        setEndDate(null);
        setSelectedStatus('');
        setSelectedDirection('');
        setSelectedRecords([]);
    };

    // Toggle filters visibility
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // Convert data to CSV format
    const convertToCSV = (data: any[]) => {
        const headers = ['Name', 'Time', 'Duration', 'Type', 'From', 'To', 'Call Status'];
        const csvContent = [
            headers.join(','),
            ...data.map(record => [
                `"${record.name || record.Name?.name || ''}"`,
                `"${record.End_time || ''}"`,
                `"${record.duration_ms || ''}"`,
                `"${record.direction || ''}"`,
                `"${record.from_number || ''}"`,
                `"${record.to_number || ''}"`,
                `"${record.call_status || ''}"`
            ].join(','))
        ].join('\n');
        
        return csvContent;
    };

    // Download CSV
    const downloadCSV = () => {
        const dataToExport = selectedRecords.length > 0 ? selectedRecords : filteredList;
        
        if (dataToExport.length === 0) {
            show("No data to export", "info");
            return;
        }

        const csvContent = convertToCSV(dataToExport);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `call_history_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        show(`Exported ${dataToExport.length} records`, "success");
    };

    const header = (
        <div className="table-header">
            <div className="header-top">
                <div className="header-actions">
                    <Button
                        label="Filters"
                        icon={showFilters ? "pi pi-filter-slash" : "pi pi-filter"}
                        onClick={toggleFilters}
                        className="filter-toggle-btn"
                        size="small"
                        outlined
                    />
                    
                    {(searchText || startDate || endDate || selectedStatus || selectedDirection) && (
                        <Button
                            label="Clear All"
                            icon="pi pi-times"
                            onClick={clearFilters}
                            className="clear-all-btn"
                            size="small"
                            severity="secondary"
                            outlined
                        />
                    )}
                </div>
                
                <div className="selection-info">
                    {selectedRecords.length > 0 && (
                        <span className="selected-count">
                            {selectedRecords.length} selected
                        </span>
                    )}
                    <span className="total-count">
                        Showing {filteredList.length} of {list.length} records
                    </span>
                </div>
                
                <Button
                    label={selectedRecords.length > 0 ? `Download Selected (${selectedRecords.length})` : `Download All (${filteredList.length})`}
                    icon="pi pi-download"
                    onClick={downloadCSV}
                    className="download-btn"
                    disabled={filteredList.length === 0}
                />
            </div>
            
            {showFilters && (
                <div className="filter-section">
                    <div className="filter-row">
                        <div className="filter-item">
                            <label>Search:</label>
                            <InputText
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search by name or number..."
                                className="search-input"
                            />
                        </div>
                        
                        <div className="filter-item">
                            <label>From Date:</label>
                            <Calendar
                                value={startDate}
                                onChange={(e) => setStartDate(e.value as Date)}
                                placeholder="Start date"
                                dateFormat="dd/mm/yy"
                                showIcon
                            />
                        </div>
                        
                        <div className="filter-item">
                            <label>To Date:</label>
                            <Calendar
                                value={endDate}
                                onChange={(e) => setEndDate(e.value as Date)}
                                placeholder="End date"
                                dateFormat="dd/mm/yy"
                                showIcon
                            />
                        </div>
                    </div>
                    
                    <div className="filter-row">
                        <div className="filter-item">
                            <label>Status:</label>
                            <Dropdown
                                value={selectedStatus}
                                options={statusOptions}
                                onChange={(e) => setSelectedStatus(e.value)}
                                placeholder="Select status"
                                className="status-dropdown"
                            />
                        </div>
                        
                        <div className="filter-item">
                            <label>Type:</label>
                            <Dropdown
                                value={selectedDirection}
                                options={directionOptions}
                                onChange={(e) => setSelectedDirection(e.value)}
                                placeholder="Select type"
                                className="direction-dropdown"
                            />
                        </div>
                        
                        <div className="filter-spacer"></div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="history">
            <Toast ref={toast} position="bottom-right" />
            <div className="card">
                <DataTable 
                    value={filteredList} 
                    tableStyle={{ minWidth: '80rem', maxHeight: '100rem', fontSize: '1.5rem' }} 
                    size='large' 
                    resizableColumns 
                    scrollable 
                    scrollHeight='65vh'
                    header={header}
                    selection={selectedRecords}
                    onSelectionChange={(e: DataTableSelectionMultipleChangeEvent<CallRecord[]>) => setSelectedRecords(e.value || [])}
                    dataKey="id"
                    selectionMode="checkbox"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="name" header="Name" sortable></Column>
                    <Column header="Time" field="End_time" sortable></Column>
                    <Column header="Duration" field="duration_ms" sortable></Column>
                    <Column header="Type" field="direction" sortable></Column>
                    <Column header="From" field="from_number" sortable></Column>
                    <Column header="To" field="to_number" sortable></Column>
                    <Column header="Call Status" field="call_status" sortable></Column>
                    <Column body={lockTemplate} header="Details"></Column>
                </DataTable>
            </div>
            
            <Sidebar 
                visible={visible} 
                onHide={() => setVisible(false)}
                position='right'
                className='sidebar'
            > 
                <h2>Call Details</h2>
                <div className='sidebar-text'>
                    {/* Audio Section - with graceful error handling */}
                    <div className='audio-section'>
                        <h3>Recording</h3>
                        {audioLoading && (
                            <div className="audio-loading">
                                <ScaleLoader height={20} width={2} radius={5} margin={2} color="#979797" />
                                <p>Loading audio...</p>
                            </div>
                        )}
                        
                        {audioError && (
                            <div className="audio-error">
                                <i className="pi pi-exclamation-triangle" style={{color: '#ff9800', marginRight: '8px'}}></i>
                                <span style={{color: '#666', fontStyle: 'italic'}}>{audioError}</span>
                            </div>
                        )}
                        
                        {audioSrc && !audioError && (
                            <audio crossOrigin='anonymous' controls src={audioSrc} style={{width: '100%'}}></audio>
                        )}
                    </div>
                    
                    {/* Content loads after API call */}
                    {detailsLoading ? (
                        <div className="details-loading">
                            <ScaleLoader height={20} width={2} radius={5} margin={2} color="#979797" />
                        </div>
                    ) : (
                        <>
                            {/* Transcript Section */}
                            <div className='transcript'>
                                <h3>Transcript</h3>
                                <p>
                                    <pre>{sideBarData?.transcript || "Loading transcript..."}</pre>  
                                </p>
                            </div>
                            
                            {/* Summary Section */}
                            <div className='summary'>
                                <h3>Summary</h3>
                                <p>
                                    {sideBarData?.summary || "Loading summary..."}
                                </p>
                            </div>
                            
                            {/* Conversation Evaluation */}
                            <ConversationEval evalData={conversationEval} />
                            
                            {/* Entity Extraction */}
                            <EntityExtraction entities={entityData} />
                        </>
                    )}
                </div>
            </Sidebar>

            {loading && (
                <div className="loader-overlay">
                    <MoonLoader size={50} color="black" />
                </div>
            )}
        </div> 
    );
};

export default History;