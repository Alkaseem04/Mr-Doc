import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X, Download, Eye, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  name: string;
  size: number;
  type: string;
  date: string;
  status: 'uploading' | 'uploaded' | 'error';
  adminSeen: boolean;
}

const ReportUpload = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();
      
      if (response.ok) {
        // Transform backend data to match frontend interface
        const transformedReports = data.map((report: any) => ({
          id: report._id,
          name: report.originalName,
          size: report.size,
          type: report.mimeType,
          date: report.uploadDate,
          status: 'uploaded',
          adminSeen: report.isVerified || false
        }));
        setReports(transformedReports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reports",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, PNG, or JPG file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('report', file);
      
      const response = await fetch('/api/reports', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Add to reports list
        const newReport: Report = {
          id: data._id,
          name: data.originalName,
          size: data.size,
          type: data.mimeType,
          date: data.uploadDate,
          status: 'uploaded',
          adminSeen: data.isVerified || false
        };
        
        setReports(prev => [...prev, newReport]);
        
        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded successfully`
        });
        
        // Send email notification to admin
        await fetch('/api/notifications/report-uploaded', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: file.name
          })
        });
      } else {
        toast({
          title: "Upload failed",
          description: data.message || "Failed to upload report",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "An error occurred during upload",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveReport = async (id: string) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setReports(prev => prev.filter(report => report.id !== id));
        
        toast({
          title: "Report removed",
          description: "The report has been deleted"
        });
      } else {
        const data = await response.json();
        toast({
          title: "Delete failed",
          description: data.message || "Failed to delete report",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "An error occurred during deletion",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'uploading':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>;
      case 'uploaded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (type.includes('image')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    }
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Medical Reports
        </CardTitle>
        <CardDescription>
          Upload your medical reports and prescriptions for easy access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload Medical Reports</h3>
          <p className="text-sm text-muted-foreground mb-4">
            PDF, PNG, or JPG files up to 10MB
          </p>
          <Button 
            className="health-button"
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                Uploading...
              </div>
            ) : (
              "Select Files"
            )}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.png,.jpg,.jpeg"
            multiple
          />
        </div>

        {reports.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Uploaded Reports</h4>
            <div className="space-y-3">
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(report.type)}
                    <div>
                      <p className="text-sm font-medium flex items-center gap-2">
                        {report.name}
                        {!report.adminSeen && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(report.size)} • {new Date(report.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(report.status)}
                      <span className="text-xs capitalize">{report.status}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => window.open(`/api/reports/${report.id}/view`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => window.open(`/api/reports/${report.id}/download`, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveReport(report.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportUpload;