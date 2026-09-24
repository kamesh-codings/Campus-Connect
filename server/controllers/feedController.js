const Event = require('../models/Event');
const Announcement = require('../models/Announcement');
const Discussion = require('../models/Discussion');
const Club = require('../models/Club');
const User = require('../models/User');

// Calculate relevance score for an item relative to a specific student/user
const calculateFeedScore = (item, user, type) => {
  let score = 0;
  const matchReasons = [];

  const userDept = user?.department || '';
  const userInterests = (user?.interests || []).map((i) => i.toLowerCase());
  const userClubs = (user?.joinedClubs || []).map((c) => c.toString());

  // 1. Department Match
  if (item.department === userDept || item.targetDepartment === userDept) {
    score += 45;
    matchReasons.push(`From your department (${userDept})`);
  }

  // 2. Joined Club Match
  const itemClubId = item.club?._id ? item.club._id.toString() : item.club?.toString();
  if (itemClubId && userClubs.includes(itemClubId)) {
    score += 60;
    matchReasons.push('From a club you joined');
  }

  // 3. Interest & Tag Overlaps
  const itemTags = (item.tags || []).map((t) => t.toLowerCase());
  const matchingInterests = userInterests.filter((interest) =>
    itemTags.some((tag) => tag.includes(interest) || interest.includes(tag))
  );

  if (matchingInterests.length > 0) {
    score += matchingInterests.length * 25;
    matchReasons.push(`Matches your interest in ${matchingInterests[0]}`);
  }

  // 4. Urgency & Priority (For Announcements)
  if (type === 'announcement') {
    if (item.priority === 'critical') {
      score += 70;
      matchReasons.push('Critical campus alert');
    } else if (item.priority === 'urgent') {
      score += 40;
      matchReasons.push('Urgent notice');
    }
  }

  // 5. Recency Score (Within 24h = +30, within 3 days = +15)
  const itemTime = new Date(item.createdAt || item.startDate).getTime();
  const now = Date.now();
  const hoursDiff = Math.abs(now - itemTime) / (1000 * 60 * 60);
  if (hoursDiff <= 24) {
    score += 30;
  } else if (hoursDiff <= 72) {
    score += 15;
  }

  // 6. Popularity / Community Engagement
  if (type === 'event') {
    const attendees = item.registeredUsers?.length || 0;
    score += Math.min(attendees * 2, 30);
  } else if (type === 'discussion') {
    const upvotes = item.upvotes?.length || 0;
    const replies = item.replies?.length || 0;
    score += Math.min(upvotes * 3 + replies * 5, 40);
    if (item.isPinned) {
      score += 35;
      matchReasons.push('Pinned by faculty');
    }
  }

  return { score, matchReasons };
};

// @desc    Get Personalized Campus Feed ("For You" vs "All")
// @route   GET /api/feed
// @access  Private
const getFeed = async (req, res) => {
  try {
    const { tab = 'for-you' } = req.query;
    const currentUser = await User.findById(req.user._id).populate('joinedClubs');

    // Fetch live feed data across 3 pillars
    const [events, announcements, discussions] = await Promise.all([
      Event.find({ startDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
        .populate('club', 'name logo category')
        .populate('createdBy', 'name avatar department')
        .limit(10),
      Announcement.find()
        .populate('author', 'name avatar role department')
        .sort({ createdAt: -1 })
        .limit(10),
      Discussion.find()
        .populate('author', 'name avatar department')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    // Format into unified stream
    const rawFeedItems = [
      ...events.map((e) => ({
        _id: e._id,
        feedType: 'event',
        title: e.title,
        description: e.description,
        venue: e.venue,
        category: e.category,
        startDate: e.startDate,
        endDate: e.endDate,
        club: e.club,
        createdBy: e.createdBy,
        tags: e.tags || [],
        registeredUsers: e.registeredUsers,
        maxCapacity: e.maxCapacity,
        createdAt: e.createdAt,
      })),
      ...announcements.map((a) => ({
        _id: a._id,
        feedType: 'announcement',
        title: a.title,
        content: a.content,
        category: a.category,
        priority: a.priority,
        targetAudience: a.targetAudience,
        targetDepartment: a.targetDepartment,
        author: a.author,
        createdAt: a.createdAt,
      })),
      ...discussions.map((d) => ({
        _id: d._id,
        feedType: 'discussion',
        title: d.title,
        body: d.body,
        category: d.category,
        tags: d.tags || [],
        author: d.author,
        upvotes: d.upvotes,
        replies: d.replies,
        isPinned: d.isPinned,
        createdAt: d.createdAt,
      })),
    ];

    if (tab === 'for-you') {
      // Score and rank items
      const scoredItems = rawFeedItems.map((item) => {
        const { score, matchReasons } = calculateFeedScore(item, currentUser, item.feedType);
        return {
          ...item,
          score,
          matchReasons: matchReasons.slice(0, 2),
        };
      });

      scoredItems.sort((a, b) => b.score - a.score);
      return res.json(scoredItems);
    }

    // Default chronological / trending
    rawFeedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(rawFeedItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error generating feed', error: error.message });
  }
};

module.exports = {
  getFeed,
};
