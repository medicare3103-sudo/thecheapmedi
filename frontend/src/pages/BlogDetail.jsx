import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Image, Card, Button } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  // Mock Blog Data (Full content)
  const mockBlogs = [
    {
      id: 1,
      title: '5 Essential Tips for Managing Type 2 Diabetes',
      category: 'Diabetes',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      date: 'June 1, 2026',
      author: 'Dr. Sarah Jenkins',
      content: `
        <p class="lead text-muted mb-4">Discover actionable strategies to maintain healthy blood sugar levels and improve your daily quality of life.</p>
        <p>Managing Type 2 Diabetes can seem daunting, but with the right lifestyle adjustments, it is entirely possible to lead a healthy, active, and fulfilling life. Here are five essential tips to help you stay on track.</p>
        
        <h4 class="mt-4 mb-3 fw-bold">1. Eat a Balanced, Nutrient-Dense Diet</h4>
        <p>Focus on incorporating a variety of whole foods into your meals. Prioritize lean proteins, healthy fats, and complex carbohydrates like whole grains, legumes, and non-starchy vegetables. These foods have a lower glycemic index, meaning they cause a slower, more gradual rise in blood sugar levels.</p>
        
        <h4 class="mt-4 mb-3 fw-bold">2. Stay Physically Active</h4>
        <p>Regular physical activity helps your body use insulin more efficiently. Aim for at least 150 minutes of moderate-intensity aerobic exercise per week, such as brisk walking, swimming, or cycling. Additionally, incorporate strength training exercises a few times a week to build muscle mass, which further aids in glucose metabolism.</p>
        
        <h4 class="mt-4 mb-3 fw-bold">3. Monitor Your Blood Sugar Levels</h4>
        <p>Keep a close eye on your blood sugar levels as recommended by your healthcare provider. Regular monitoring allows you to understand how different foods, activities, and stressors affect your body, enabling you to make informed adjustments to your routine.</p>
        
        <h4 class="mt-4 mb-3 fw-bold">4. Manage Stress Effectively</h4>
        <p>Chronic stress can trigger hormones that elevate blood sugar levels. Incorporate stress-reduction techniques into your daily life, such as mindfulness meditation, deep breathing exercises, or engaging in hobbies you enjoy.</p>
        
        <h4 class="mt-4 mb-3 fw-bold">5. Get Adequate Sleep</h4>
        <p>Poor sleep quality can disrupt hormones related to appetite and insulin sensitivity. Aim for 7-9 hours of restful sleep each night. Establish a consistent sleep schedule and create a relaxing bedtime routine to improve your overall sleep hygiene.</p>
        
        <div class="bg-light p-4 rounded-3 border-start border-4 border-primary mt-5 mb-4">
          <p class="mb-0 fst-italic">"Small, consistent changes in your daily routine can yield significant long-term improvements in managing Type 2 Diabetes."</p>
        </div>
      `
    },
    {
      id: 2,
      title: 'The Hidden Benefits of Daily Hydration',
      category: 'Wellness',
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      date: 'May 28, 2026',
      author: 'Mark Rutherford',
      content: `
        <p class="lead text-muted mb-4">Water does more than just quench your thirst. Learn how proper hydration impacts your immune system and skin health.</p>
        <p>We all know we should drink more water, but understanding exactly *why* can provide the motivation needed to stay consistently hydrated. Beyond simple thirst quenching, water is the lifeblood of nearly every bodily function.</p>
        
        <h4 class="mt-4 mb-3 fw-bold">Boosts Cognitive Function</h4>
        <p>Even mild dehydration can impair cognitive performance, leading to difficulties with concentration, memory, and mood regulation. Staying hydrated keeps your brain functioning optimally, improving focus and mental clarity throughout the day.</p>
        
        <h4 class="mt-4 mb-3 fw-bold">Enhances Skin Health</h4>
        <p>Your skin is an organ, and like any other organ, it requires water to function properly. Adequate hydration helps maintain skin elasticity, reduces the appearance of fine lines, and promotes a healthy, radiant complexion by flushing out toxins.</p>
        
        <h4 class="mt-4 mb-3 fw-bold">Supports Digestive Efficiency</h4>
        <p>Water is essential for healthy digestion. It helps break down food, allowing your body to absorb nutrients effectively. Moreover, it prevents constipation by softening stools and keeping the digestive tract running smoothly.</p>
      `
    }
    // I am mocking just a couple of full articles for demonstration. In a real app, this would be fetched from an API.
  ];

  useEffect(() => {
    // Find the blog or fallback to the first one if not found (for demonstration)
    const foundBlog = mockBlogs.find(b => b.id === parseInt(id));
    if (foundBlog) {
      setBlog(foundBlog);
    } else {
      // Just mock generic data if id doesn't match 1 or 2
      setBlog({
        id: id,
        title: 'Understanding Health and Wellness in 2026',
        category: 'General',
        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        date: 'Recent',
        author: 'Medicare Staff',
        content: `
          <p class="lead text-muted mb-4">A comprehensive look at maintaining your health.</p>
          <p>This is a placeholder article for the requested blog post. In a fully connected backend environment, this content would be dynamically loaded based on the requested ID.</p>
          <p>Please refer to articles 1 or 2 for a full mock experience.</p>
        `
      });
    }
  }, [id]);

  if (!blog) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-column">
        <Header />
        <Container className="py-5 text-center flex-grow-1 d-flex flex-column justify-content-center">
            <div className="spinner-border text-primary mx-auto" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />
      
      <Container className="py-4 flex-grow-1">
        
        {/* Back Button */}
        <div className="mb-4">
            <Button variant="link" className="text-decoration-none text-muted p-0" onClick={() => navigate('/blogs')}>
                <i className="bi bi-arrow-left me-2"></i>Back to Articles
            </Button>
        </div>

        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            
            {/* Article Header */}
            <div className="text-center mb-5">
              <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill fs-6">
                {blog.category}
              </Badge>
              <h1 className="fw-bold display-5 mb-4 text-dark">{blog.title}</h1>
              
              <div className="d-flex justify-content-center align-items-center text-muted">
                <div className="d-flex align-items-center me-4">
                    <i className="bi bi-person-circle fs-4 me-2 text-primary"></i>
                    <span className="fw-500">{blog.author}</span>
                </div>
                <div className="d-flex align-items-center">
                    <i className="bi bi-calendar-event fs-5 me-2"></i>
                    <span>{blog.date}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-5">
                <Image 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-100 object-fit-cover" 
                    style={{ maxHeight: '500px' }}
                />
            </Card>

            {/* Article Content */}
            <div 
                className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light article-content"
                style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444' }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Author / Share Box */}
            <Card className="border-0 bg-white shadow-sm rounded-4 mt-5 p-4">
                <Row className="align-items-center">
                    <Col md={8} className="mb-3 mb-md-0">
                        <div className="d-flex align-items-center">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                                {blog.author.charAt(0)}
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">{blog.author}</h5>
                                <p className="text-muted mb-0 small">Medical Writer & Health Enthusiast</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4} className="text-md-end">
                        <div className="d-flex gap-2 justify-content-md-end">
                            <Button variant="outline-primary" className="rounded-circle" style={{width: '40px', height: '40px', padding: 0}}><i className="bi bi-facebook"></i></Button>
                            <Button variant="outline-info" className="rounded-circle" style={{width: '40px', height: '40px', padding: 0}}><i className="bi bi-twitter"></i></Button>
                            <Button variant="outline-success" className="rounded-circle" style={{width: '40px', height: '40px', padding: 0}}><i className="bi bi-whatsapp"></i></Button>
                        </div>
                    </Col>
                </Row>
            </Card>

          </Col>
        </Row>
      </Container>
      
      <Footer />
    </div>
  );
}

export default BlogDetail;
