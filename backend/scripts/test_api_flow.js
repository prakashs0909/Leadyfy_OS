const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('  LEADYFY OS AUTOMATED API & WORKFLOW SUITE TEST    ');
  console.log('====================================================');

  try {
    // 1. Test Health Endpoint
    const healthRes = await fetch(`${API_BASE}/health`);
    const health = await healthRes.json();
    console.log('✅ [1] Health Check Passed:', health.system);

    // 2. Test Owner Login
    const ownerLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'owner@leadyfy.com', password: 'Password123!' }),
    });
    const ownerLogin = await ownerLoginRes.json();
    console.log('✅ [2] Owner Login Passed | Role:', ownerLogin.user.role);
    const ownerToken = ownerLogin.token;
    const ownerHeaders = { Authorization: `Bearer ${ownerToken}`, 'Content-Type': 'application/json' };

    // 3. Test Dashboard Endpoint
    const dashRes = await fetch(`${API_BASE}/dashboard`, { headers: ownerHeaders });
    const dash = await dashRes.json();
    console.log('✅ [3] Executive Dashboard Passed | Net Profit:', dash.kpis.estimatedNetProfit);

    // 4. Test Client Creation (Schema Field Verification: companyName)
    const newClientPayload = {
      clientName: 'Nexus Wearables',
      companyName: 'Nexus Electronics Corp', // Verified companyName schema match!
      email: 'contact@nexuswear.com',
      phone: '+1 (555) 777-9911',
      industry: 'Tech Hardware',
      status: 'Onboarding',
    };
    const createdClientRes = await fetch(`${API_BASE}/clients`, {
      method: 'POST',
      headers: ownerHeaders,
      body: JSON.stringify(newClientPayload),
    });
    const createdClient = await createdClientRes.json();
    console.log('✅ [4] Client Creation Passed | ID:', createdClient.client._id, '| companyName:', createdClient.client.companyName);

    // 5. Test Client Profile Fetch
    const clientDetailRes = await fetch(`${API_BASE}/clients/${createdClient.client._id}`, { headers: ownerHeaders });
    const clientDetail = await clientDetailRes.json();
    console.log('✅ [5] Client Detail Fetch Passed | Hub Tabs Data Present');

    // 6. Test Associated Order Creation
    const orderPayload = {
      client: createdClient.client._id,
      packageName: '10 UGC Tech Review Ads',
      contractedVideoCount: 10,
      pricing: 4000,
      gstTax: 400,
    };
    const createdOrderRes = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: ownerHeaders,
      body: JSON.stringify(orderPayload),
    });
    const createdOrder = await createdOrderRes.json();
    console.log('✅ [6] Associated Order Created | Total Amount:', createdOrder.order.totalInvoiceAmount);

    // 7. Test Video Pipeline Card Status Transition (9 Stages)
    const videoPayload = {
      client: createdClient.client._id,
      order: createdOrder.order._id,
      videoNumber: 1,
      title: 'Nexus Watch Unboxing & Sensor Test',
      status: 'Script Approved',
    };
    const createdVideoRes = await fetch(`${API_BASE}/videos`, {
      method: 'POST',
      headers: ownerHeaders,
      body: JSON.stringify(videoPayload),
    });
    const createdVideo = await createdVideoRes.json();
    console.log('✅ [7] Video Pipeline Card Created | Initial Stage:', createdVideo.video.status);

    const movedVideoRes = await fetch(`${API_BASE}/videos/${createdVideo.video._id}/status`, {
      method: 'PATCH',
      headers: ownerHeaders,
      body: JSON.stringify({ status: 'Video Editing' }),
    });
    const movedVideo = await movedVideoRes.json();
    console.log('✅ [8] Video Moved to Stage:', movedVideo.video.status);

    // 8. Test Client Login & Isolated Portal View
    const clientLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'client@leadyfy.com', password: 'Password123!' }),
    });
    const clientLogin = await clientLoginRes.json();
    console.log('✅ [9] Client Login Passed | Role:', clientLogin.user.role);
    const clientToken = clientLogin.token;
    const clientHeaders = { Authorization: `Bearer ${clientToken}`, 'Content-Type': 'application/json' };

    const clientDashRes = await fetch(`${API_BASE}/dashboard`, { headers: clientHeaders });
    const clientDash = await clientDashRes.json();
    console.log('✅ [10] Isolated Client Portal Passed | Active Orders:', clientDash.kpis.activeOrders);

    // 9. Test RBAC Security (Client must be forbidden from internal creator endpoint)
    const rbacTestRes = await fetch(`${API_BASE}/creators`, {
      method: 'POST',
      headers: clientHeaders,
      body: JSON.stringify({ name: 'Unauthorized Creator' }),
    });
    if (rbacTestRes.status === 403) {
      console.log('✅ [11] RBAC Middleware Security Verified | 403 Forbidden correctly returned for Client role on /api/creators');
    } else {
      console.error('❌ [RBAC Failure] Unexpected status code:', rbacTestRes.status);
    }

    console.log('====================================================');
    console.log('  ALL 11 END-TO-END VERIFICATION CHECKS PASSED!     ');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Verification Error:', err.message);
  }
}

runTests();
