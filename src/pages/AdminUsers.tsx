import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Eye, Edit, Trash2, User, UserCheck, UserX, Upload, Download, FileText, Calendar, CheckCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import SEO from '../components/SEO';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  phone: string;
  isActive: boolean;
  isVerified: boolean;
  lastLogin: string;
  createdAt: string;
}

interface Report {
  id: string;
  patientId: string;
  patientName: string;
  fileName: string;
  date: string;
  adminSeen: boolean;
}

interface SecurityLog {
  id: string;
  user: {
    name: string;
    email: string;
  };
  email: string;
  action: string;
  ip: string;
  status: string;
  timestamp: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  // Fetch users, reports, and security logs from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users
        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json();
        
        // Fetch reports
        const reportsResponse = await fetch('/api/reports/admin/all');
        const reportsData = await reportsResponse.json();
        
        // Fetch security logs
        const logsResponse = await fetch('/api/security-logs');
        const logsData = await logsResponse.json();
        
        setUsers(usersData);
        setReports(reportsData);
        setSecurityLogs(logsData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter users based on search term and role
  useEffect(() => {
    let result = users;
    
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, roleFilter, users]);

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
    
    // Update filtered users as well
    setFilteredUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const handleViewReports = (userId: string) => {
    // In a real implementation, this would navigate to the user's reports
    alert(`Viewing reports for user ${userId}`);
  };

  const handleViewProfile = (userId: string) => {
    // In a real implementation, this would navigate to the user's profile
    alert(`Viewing profile for user ${userId}`);
  };

  const handleMarkReportAsSeen = (reportId: string) => {
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === reportId ? { ...report, adminSeen: true } : report
      )
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800"><UserCheck className="h-3 w-3 mr-1" />Admin</Badge>;
      case 'doctor':
        return <Badge className="bg-blue-100 text-blue-800"><UserCheck className="h-3 w-3 mr-1" />Doctor</Badge>;
      case 'patient':
        return <Badge className="bg-green-100 text-green-800"><User className="h-3 w-3 mr-1" />Patient</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800"><User className="h-3 w-3 mr-1" />User</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-green-100 text-green-800">Active</Badge> : 
      <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'login_attempt':
        return <Badge className="bg-blue-100 text-blue-800">Login Attempt</Badge>;
      case 'otp_verified':
        return <Badge className="bg-green-100 text-green-800">OTP Verified</Badge>;
      case 'password_reset':
        return <Badge className="bg-purple-100 text-purple-800">Password Reset</Badge>;
      case 'failed_login':
        return <Badge className="bg-red-100 text-red-800">Failed Login</Badge>;
      case 'logout':
        return <Badge className="bg-yellow-100 text-yellow-800">Logout</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{action}</Badge>;
    }
  };

  const getLogStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getUnseenReportsCount = () => {
    return reports.filter(report => !report.adminSeen).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Admin Users Management - Mr.Doc"
        description="Manage users, doctors, and administrators in the Mr.Doc healthcare platform."
        keywords={["admin", "users", "management", "doctors", "patients", "healthcare"]}
      />
      
      <div className="health-container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Manage all users and reports in the system</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs for Users, Reports, and Security Logs */}
        <div className="flex gap-4 mb-6">
          <Button 
            variant={activeTab === 'users' ? 'default' : 'outline'}
            className={activeTab === 'users' ? 'health-button' : 'border-border text-foreground hover:bg-muted'}
            onClick={() => setActiveTab('users')}
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </Button>
          <Button 
            variant={activeTab === 'reports' ? 'default' : 'outline'}
            className={activeTab === 'reports' ? 'health-button' : 'border-border text-foreground hover:bg-muted'}
            onClick={() => setActiveTab('reports')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Reports
            {getUnseenReportsCount() > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">
                {getUnseenReportsCount()}
              </Badge>
            )}
          </Button>
          <Button 
            variant={activeTab === 'security' ? 'default' : 'outline'}
            className={activeTab === 'security' ? 'health-button' : 'border-border text-foreground hover:bg-muted'}
            onClick={() => setActiveTab('security')}
          >
            <Shield className="h-4 w-4 mr-2" />
            Security Logs
          </Button>
        </div>

        {activeTab === 'users' ? (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User List
              </CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-48">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="font-medium">{user.name}</div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                          <TableCell>
                            {user.isVerified ? (
                              <Badge className="bg-green-100 text-green-800">Verified</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-border"
                                onClick={() => handleViewProfile(user.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-border"
                                onClick={() => handleViewReports(user.id)}
                              >
                                <Upload className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="border-border">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className={user.isActive ? "border-red-500 text-red-500 hover:bg-red-500/10" : "border-green-500 text-green-500 hover:bg-green-500/10"}
                                onClick={() => handleToggleUserStatus(user.id)}
                              >
                                {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        ) : activeTab === 'reports' ? (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Medical Reports
              </CardTitle>
              <CardDescription>
                Manage and review patient medical reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>File Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="font-medium">{report.patientName}</div>
                          </TableCell>
                          <TableCell>{report.fileName}</TableCell>
                          <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {report.adminSeen ? (
                              <Badge className="bg-green-100 text-green-800">Reviewed</Badge>
                            ) : (
                              <Badge className="bg-blue-100 text-blue-800">New</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-border"
                                onClick={() => handleMarkReportAsSeen(report.id)}
                                disabled={report.adminSeen}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="border-border">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="border-border">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Logs
              </CardTitle>
              <CardDescription>
                Monitor all security events and user activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>User Email</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {securityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{getActionBadge(log.action)}</TableCell>
                          <TableCell>{log.email}</TableCell>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{log.ip}</TableCell>
                          <TableCell>{getLogStatusBadge(log.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;