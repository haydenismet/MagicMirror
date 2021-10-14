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
		this.pData.posts.forEach((item, indexItem) => {
			if (indexItem < 3) {
				let productPostContainer = document.createElement("div");
				productPostContainer.className = `product-post-container id-${item.id}`;

				let productDetails = document.createElement("div");
				productDetails.className = "product-details";

				let productPostTitle = document.createElement("h1");
				productPostTitle.className = "product-post-title";
				productPostTitle.innerHTML = item.name;

				let productPostTagline = document.createElement("p");
				productPostTagline.innerHTML = item.tagline;

				let productImg = document.createElement("img");
				productImg.src = item.thumbnail.image_url;

				let topicContainer = document.createElement("div");
				topicContainer.className = "topic-container";

				let topicSlice = item.topics.slice(0, 2);

				topicSlice.forEach((topic) => {
					let topicItem = document.createElement("span");
					topicItem.className = `topics ${topic.slug}`;
					topicItem.innerHTML = topic.name;
					topicContainer.appendChild(topicItem);
				});

				let productContainer = document.createElement("div");
				productContainer.className = "product-container";

				productContainer.appendChild(productImg);
				productContainer.appendChild(productDetails);

				productDetails.appendChild(productPostTitle);
				productDetails.appendChild(productPostTagline);

				productPostContainer.appendChild(productContainer);
				productPostContainer.appendChild(topicContainer);

				wrapper.appendChild(productPostContainer);
			}
		});
	},
	getProductHunt() {
		fetch("https://api.producthunt.com/v1/posts/", {
			headers: {
				Authorization: `Bearer ${APIKEY}`,
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
