Module.register("MMM-Product-Hunt", {
	defaults: {
		fetchInterval: 60 * 60000
	},
	getStyles() {
		return [this.file("mm-product-hunt-styles.css")];
	},
	pData: null,
	notificationReceived(notification, payload, sender) {
		if (notification === "MODULE_DOM_CREATED") {
			this.getProductHunt();
			setInterval(() => {
				this.getProductHunt();
			}, this.config.fetchInterval);
		}
	},
	getDom() {
		const wrapper = document.createElement("div");
		wrapper.className = "wrapper";
		if (this.pData === null) return wrapper;

		this.setupHTMLStructure(wrapper);

		return wrapper;
	},
	setupHTMLStructure(wrapper) {
		console.log(this.pData.posts);
		let activeIndex = 0;
		let productPostContainer = document.createElement("div");
		let productDetails = document.createElement("div");
		let productPostTitle = document.createElement("h1");
		let productPostTagline = document.createElement("p");
		let productImg = document.createElement("img");
		let topicContainer = document.createElement("div");
		let productContainer = document.createElement("div");
		let topicItem1 = document.createElement("span");
		let topicItem2 = document.createElement("span");

		setInterval(() => {
			if (activeIndex < this.pData.posts.length) {
				console.log(activeIndex);
				productPostContainer.id = "product-hunt-main-div";
				productPostContainer.className = `product-post-container active`;
				productPostContainer.setAttribute(`data-index`, activeIndex);

				productDetails.id = "product-details";

				productPostTitle.id = "product-post-title";
				productPostTitle.innerHTML = this.pData.posts[activeIndex].name;

				productPostTagline.id = "product-post-p";
				productPostTagline.innerHTML = this.pData.posts[activeIndex].tagline;

				productImg.src = this.pData.posts[activeIndex].thumbnail.image_url;
				productImg.id = "product-hunt-img";

				topicContainer.id = "topic-container";

				let topicSlice = this.pData.posts[activeIndex].topics.slice(0, 2);

				console.log(topicSlice);
				topicItem1.id = `topics-${topicSlice[0].slug}`;
				topicItem1.className = "topics-styling";
				topicItem2.className = "topics-styling";
				topicItem1.innerHTML = topicSlice[0].name;
				topicContainer.appendChild(topicItem2);
				if (topicSlice.length > 1) {
					topicItem2.id = `topics-${topicSlice[1].slug}`;
					topicItem2.innerHTML = topicSlice[1].name;
					topicContainer.appendChild(topicItem1);
				}

				productContainer.id = "product-container";

				productContainer.appendChild(productImg);
				productContainer.appendChild(productDetails);

				productDetails.appendChild(productPostTitle);
				productDetails.appendChild(productPostTagline);

				productPostContainer.appendChild(productContainer);
				productPostContainer.appendChild(topicContainer);

				activeIndex++;
			} else {
				activeIndex = 0;
			}
		}, 10000);

		wrapper.appendChild(productPostContainer);
	},
	getProductHunt() {
		fetch("https://api.producthunt.com/v1/posts/", {
			headers: {
				Authorization: `Bearer `,
				Accept: "application/json",
				"Content-Type": "application/json",
				Host: "api.producthunt.com"
			},
			method: "GET"
		}).then((response) => {
			response.json().then((pData) => {
				this.pData = pData;
				console.log(pData);
				this.updateDom();
			});
		});
	}
});
