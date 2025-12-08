const feedbackModel = require('../models/feedbackModel');

exports.feedbackForm = (req, res) => {
  res.render('feedback/new', { title: 'Leave Feedback' });
};

exports.submitFeedback = async (req, res) => {
  const { message } = req.body;
  const account = res.locals.account;

  if (!message || message.trim().length < 5) {
    req.flash('notice', 'Feedback must be at least 5 characters.');
    return res.redirect('/feedback/new');
  }

  try {
    await feedbackModel.addFeedback(account.account_id, message.trim());
    req.flash('success', 'Thank you for your feedback!');
    res.redirect('/account');
  } catch (err) {
    req.flash('notice', 'Error submitting feedback.');
    res.redirect('/feedback/new');
  }
};

exports.viewFeedback = async (req, res) => {
  const account = res.locals.account;
  const isStaff = account && (account.account_type === 'Employee' || account.account_type === 'Admin');

  if (!isStaff) {
    req.flash('notice', 'Only staff can view all feedback.');
    return res.redirect('/account');
  }

  const feedback = await feedbackModel.getAllFeedback();
  res.render('feedback/manage', { title: 'Manage Feedback', feedback });
};
