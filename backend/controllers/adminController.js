const User = require('../models/User');
const Product = require('../models/Products');
const Order = require('../models/Order');
const axios = require('axios');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalProducts = await Product.productmodel.countDocuments();

        const totalOrders = await Order.countDocuments();

        const totalRevenue = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]);

        const pendingOrders = await Order.countDocuments({
            $and: [
                { isDelivered: { $ne: true } },
                { isShipped: { $ne: true } }
            ]
        });

        const shippedOrders = await Order.countDocuments({
            isShipped: true,
            isDelivered: { $ne: true }
        });

        const deliveredOrders = await Order.countDocuments({ isDelivered: true });



        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            pendingOrders,
            shippedOrders,
            deliveredOrders,
        });
    } catch (err) {
        console.error('Error in getDashboardStats:', err);
        res.status(500).json({ message: 'Error fetching dashboard stats', error: err.message });
    }
};

exports.generateAIReport = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.productmodel.countDocuments();
        const totalOrders = await Order.countDocuments();

        const totalRevenue = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]);

        const pendingOrders = await Order.countDocuments({
            $and: [
                { isDelivered: { $ne: true } },
                { isShipped: { $ne: true } }
            ]
        });

        const shippedOrders = await Order.countDocuments({
            isShipped: true,
            isDelivered: { $ne: true }
        });

        const deliveredOrders = await Order.countDocuments({ isDelivered: true });

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name');

        const topProducts = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.product",
                    totalSold: { $sum: "$orderItems.qty" },
                    name: { $first: "$orderItems.name" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        const revenueFigure = totalRevenue[0]?.total || 0;
        const averageOrderValue = totalOrders > 0 ? (revenueFigure / totalOrders) : 0;
        const fulfillmentRate = totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100) : 0;

        const businessData = {
            metrics: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue: revenueFigure,
                pendingOrders,
                shippedOrders,
                deliveredOrders,
                averageOrderValue,
                fulfillmentRate
            },
            recentOrders: recentOrders.map(order => ({
                id: order._id,
                customer: order.user?.name || 'Unknown',
                total: order.totalPrice,
                status: order.status || (order.isDelivered ? 'Delivered' : (order.isShipped ? 'Shipped' : 'Pending')),
                date: order.createdAt
            })),
            topProducts: topProducts.map(product => ({
                id: product._id,
                name: product.name,
                totalSold: product.totalSold
            }))
        };

        const report = await generateAIReport(businessData);
        res.json(report);
    } catch (err) {
        console.error('Error generating AI report:', err);
        res.status(500).json({
            message: 'Failed to generate AI report',
            error: err.message
        });
    }
};

async function generateAIReport(data) {
    console.log("Generating AI report with business data...");

    try {
        console.log("Creating mock AI response based on real business data");

        const {
            totalRevenue,
            totalOrders,
            pendingOrders,
            shippedOrders,
            deliveredOrders,
            totalProducts,
            averageOrderValue,
            fulfillmentRate
        } = data.metrics;

        const insights = [];

        if (totalRevenue > 10000) {
            insights.push(`Strong revenue performance of $${totalRevenue.toLocaleString()} indicates a healthy business. Focus on scaling operations while maintaining quality.`);
        } else if (totalRevenue > 5000) {
            insights.push(`Moderate revenue of $${totalRevenue.toLocaleString()} shows promise. Consider marketing campaigns to increase sales volume.`);
        } else {
            insights.push(`Current revenue of $${totalRevenue.toLocaleString()} suggests a need for increased marketing efforts and possibly revisiting pricing strategy.`);
        }

        const pendingPercentage = totalOrders > 0 ? ((pendingOrders / totalOrders) * 100).toFixed(1) : 0;
        if (pendingPercentage > 30) {
            insights.push(`High percentage of pending orders (${pendingPercentage}%) indicates potential bottlenecks in your fulfillment process that need attention.`);
        } else {
            insights.push(`Your order fulfillment rate is ${fulfillmentRate}%, with delivered orders accounting for most of your sales, showing efficient operations.`);
        }

        if (totalProducts < 20) {
            insights.push(`Limited product catalog of ${totalProducts} items may be restricting sales potential. Consider expanding your product range.`);
        } else if (totalProducts > 50) {
            insights.push(`Diverse product catalog with ${totalProducts} items provides customers with good variety. Focus on optimizing performance of top sellers.`);
        } else {
            insights.push(`Your product catalog of ${totalProducts} items is moderately sized. Consider adding complementary products to top sellers.`);
        }

        const recommendations = [
            `Focus on converting the ${pendingOrders} pending orders worth approximately $${(averageOrderValue * pendingOrders).toFixed(2)} to improve immediate cash flow.`,
            `Implement automated follow-ups for abandoned carts to recover potential lost sales and increase conversion rate.`
        ];

        if (data.topProducts && data.topProducts.length > 0) {
            const topProduct = data.topProducts[0];
            recommendations.push(`Your best-selling product "${topProduct.name}" has sold ${topProduct.totalSold} units. Consider creating bundle deals with this product to increase average order value.`);
        }

        if (shippedOrders > deliveredOrders) {
            recommendations.push(`You have ${shippedOrders} orders in transit but only ${deliveredOrders} delivered. Consider implementing delivery tracking to improve customer experience.`);
        }

        if (averageOrderValue < 100) {
            recommendations.push(`Your average order value of $${averageOrderValue.toFixed(2)} has room for improvement. Implement cross-selling and upselling strategies on product and checkout pages.`);
        }

        const trends = [
            `Your average order value of $${averageOrderValue.toFixed(2)} compared to industry average suggests ${averageOrderValue > 75 ? 'strong' : 'opportunity for'} customer purchase behavior.`,
            `Order fulfillment metrics show ${fulfillmentRate > 70 ? 'efficient' : 'room for improvement in'} operational processes, affecting overall customer satisfaction.`
        ];

        return {
            summary: {
                totalRevenue: data.metrics.totalRevenue,
                totalOrders: data.metrics.totalOrders,
                averageOrderValue: data.metrics.averageOrderValue.toFixed(2),
                fulfillmentRate: data.metrics.fulfillmentRate.toFixed(1),
                pendingRevenue: (data.metrics.averageOrderValue * data.metrics.pendingOrders).toFixed(2)
            },
            insights,
            recommendations,
            trends,
            topProducts: data.topProducts.slice(0, 3),
            dateGenerated: new Date().toISOString()
        };
    } catch (error) {
        console.error("Error generating report:", error);
        throw new Error("Failed to generate AI report: " + error.message);
    }
} 