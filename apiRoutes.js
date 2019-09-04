
module.exports = (router, denonRouteMethods) => {

	// account
	router.get('/settings', denonRouteMethods.settings)
	router.post('/execute', denonRouteMethods.settings)

	return router
}