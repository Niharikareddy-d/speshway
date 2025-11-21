import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api, { getBaseUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LogOut, ArrowLeft, Mail, Send, MessageSquare } from 'lucide-react';

const Submissions = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [replyDialogOpen, setReplyDialogOpen] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['submissions', statusFilter, typeFilter],
    queryFn: async () => {
      try {
        const response = await api.get('/contact/submissions');
        const responseData = response.data;
        // Handle different response structures
        if (responseData.success && responseData.data) {
          return responseData.data;
        }
        if (Array.isArray(responseData)) {
          return responseData;
        }
        if (responseData.data && Array.isArray(responseData.data)) {
          return responseData.data;
        }
        return [];
      } catch (err: any) {
        console.error('Error fetching submissions:', err);
        throw err;
      }
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/contact/submission/${id}/status`, { status }),
    onSuccess: (response, variables) => {
      // Optimistically update the cache
      queryClient.setQueryData(['submissions', statusFilter, typeFilter], (old: any) => {
        if (!old) return old;
        return old.map((submission: any) => 
          submission._id === variables.id 
            ? { ...submission, status: variables.status }
            : submission
        );
      });
      // Invalidate to refresh
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast({
        title: 'Status updated successfully',
        description: 'The submission status has been updated.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating status',
        description: error.response?.data?.message || 'Failed to update the submission status.',
        variant: 'destructive',
      });
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      api.post(`/contact/submission/${id}/reply`, { message }),
    onSuccess: (response, variables) => {
      const updatedSubmission = response.data?.data || response.data;
      // Optimistically update the cache
      queryClient.setQueryData(['submissions', statusFilter, typeFilter], (old: any) => {
        if (!old) return old;
        return old.map((submission: any) => 
          submission._id === variables.id 
            ? updatedSubmission
            : submission
        );
      });
      // Invalidate to refresh
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast({
        title: 'Reply sent successfully',
        description: 'Your reply has been sent via email and saved.',
      });
      setReplyMessage('');
      setReplyDialogOpen(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error sending reply',
        description: error.response?.data?.message || 'Failed to send reply.',
        variant: 'destructive',
      });
    },
  });

  const handleReply = (submissionId: string) => {
    if (!replyMessage.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a reply message.',
        variant: 'destructive',
      });
      return;
    }
    replyMutation.mutate({ id: submissionId, message: replyMessage });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out.",
    });
  };

  const filteredData = data?.filter((submission: any) => {
    // Ensure status has a default value
    const status = submission.status || 'new';
    const type = submission.type || 'contact';
    
    if (statusFilter !== 'all' && status !== statusFilter) {
      return false;
    }
    if (typeFilter !== 'all' && type !== typeFilter) {
      return false;
    }
    return true;
  }) || [];

  const getStatusBadge = (status: string) => {
    const statusValue = status || 'new';
    switch (statusValue) {
      case 'new':
        return <Badge variant="default" className="bg-primary text-primary-foreground">New</Badge>;
      case 'read':
        return <Badge variant="secondary">Read</Badge>;
      case 'replied':
        return <Badge variant="outline">Replied</Badge>;
      default:
        return <Badge variant="secondary">{statusValue}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'contact':
        return <Badge variant="default" className="bg-primary text-primary-foreground">Contact</Badge>;
      case 'resume':
        return <Badge variant="secondary">Resume</Badge>;
      case 'message':
        return <Badge variant="outline">Message</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </section>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">An error has occurred: {error.message}</div>
        </div>
      </section>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Submissions</h1>
                  <p className="text-muted-foreground">Manage contact form submissions and resumes</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle>Submissions</CardTitle>
                <CardDescription>View and manage all contact form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="resume">Resume</SelectItem>
                      <SelectItem value="message">Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {filteredData.map((submission: any) => (
                    <Card key={submission._id} className="border-l-4 border-l-primary bg-card/30">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{submission.name}</CardTitle>
                            <CardDescription>{submission.email}</CardDescription>
                            {submission.phone && <p className="text-sm text-muted-foreground">{submission.phone}</p>}
                          </div>
                          <div className="flex gap-2">
                            {getTypeBadge(submission.type || 'contact')}
                            {getStatusBadge(submission.status || 'new')}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {submission.subject && (
                            <div>
                              <h4 className="font-medium text-sm">Subject</h4>
                              <p className="text-sm">{submission.subject}</p>
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-sm">Message</h4>
                            <p className="text-sm text-muted-foreground">{submission.message}</p>
                          </div>
                          {submission.resume && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const baseUrl = getBaseUrl();
                                  const urlField = submission.resume.url as string | undefined;
                                  const fileName = (submission.resume.filename as string | undefined) || undefined;
                                  const rawPath = (submission.resume.path as string | undefined) || undefined;
                                  let relativeUrl = '';
                                  if (urlField && typeof urlField === 'string') {
                                    relativeUrl = urlField;
                                  } else if (fileName && typeof fileName === 'string') {
                                    relativeUrl = `/uploads/${fileName}`;
                                  } else if (rawPath && typeof rawPath === 'string') {
                                    const parts = rawPath.split(/\\|\//);
                                    const last = parts[parts.length - 1];
                                    relativeUrl = `/uploads/${last}`;
                                  }
                                  const finalUrl = relativeUrl.startsWith('http') 
                                    ? relativeUrl 
                                    : `${baseUrl}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
                                  window.open(finalUrl, '_blank');
                                }}
                              >
                                View Resume
                              </Button>
                              <span className="text-xs text-muted-foreground">
                                {submission.resume.originalName || submission.resume.filename || 'Resume'} 
                                {submission.resume.size && ` (${(submission.resume.size / 1024 / 1024).toFixed(2)} MB)`}
                              </span>
                            </div>
                          )}
                          {/* Replies Section */}
                          {submission.replies && submission.replies.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                                <MessageSquare size={16} className="text-primary" />
                                Replies ({submission.replies.length})
                              </h4>
                              <div className="space-y-3">
                                {submission.replies.map((reply: any, index: number) => (
                                  <div key={index} className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <p className="text-sm font-medium text-foreground">{reply.repliedBy}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {reply.repliedAt ? new Date(reply.repliedAt).toLocaleString() : 'N/A'}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reply.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-2 flex-wrap">
                            <Select
                              value={submission.status || 'new'}
                              onValueChange={(newStatus) => updateStatusMutation.mutate({ id: submission._id, status: newStatus })}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="read">Read</SelectItem>
                                <SelectItem value="replied">Replied</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-2"
                                onClick={() => {
                                  setReplyDialogOpen(submission._id);
                                  setReplyMessage('');
                                }}
                              >
                                <Mail size={14} />
                                Reply
                              </Button>
                              <Dialog 
                                open={replyDialogOpen === submission._id} 
                                onOpenChange={(open) => {
                                  setReplyDialogOpen(open ? submission._id : null);
                                  if (!open) setReplyMessage('');
                                }}
                              >
                                <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Reply to {submission.name}</DialogTitle>
                                  <DialogDescription>
                                    Send a reply to {submission.email}. The reply will be sent via email and saved.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                    <div>
                                      <Label className="text-xs text-muted-foreground">Original Message</Label>
                                      <p className="text-sm mt-1">{submission.message}</p>
                                    </div>
                                    {submission.subject && (
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Subject</Label>
                                        <p className="text-sm mt-1">{submission.subject}</p>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="reply-message">Your Reply</Label>
                                    <Textarea
                                      id="reply-message"
                                      placeholder="Type your reply here..."
                                      value={replyMessage}
                                      onChange={(e) => setReplyMessage(e.target.value)}
                                      className="min-h-[200px] mt-2"
                                      rows={8}
                                    />
                                  </div>
                                  
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setReplyDialogOpen(null);
                                        setReplyMessage('');
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => handleReply(submission._id)}
                                      disabled={replyMutation.isPending || !replyMessage.trim()}
                                      className="flex items-center gap-2"
                                    >
                                      {replyMutation.isPending ? (
                                        <>
                                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                          Sending...
                                        </>
                                      ) : (
                                        <>
                                          <Send size={16} />
                                          Send Reply
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            </>
                            
                            <span className="text-xs text-muted-foreground">
                              {submission.createdAt ? new Date(submission.createdAt).toLocaleString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredData.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No submissions found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Submissions;
