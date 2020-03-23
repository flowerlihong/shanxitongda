export default {
	count: (state) => {
		return state.count;
	},
	getOdd: (state) => {
		return state.count % 2 == 0 ? '偶数' : '奇数'
	},
	total: (state) => {
    	var sum = 0.0;
    	state.lists.forEach((item)=> {
    	sum+=item.price==''?0:parseFloat(item.price);
    	// console.log(item.price);
    	});
    	return sum;
	},
	printTotal: (state) => {
		var he =0.0;
		state.printList.forEach((item)=> {
			he+= item.money==""?0:parseFloat(item.money);
		});
		return he;
	},
	//过滤搜索
 	computedList: (state) => {

       	return state.xmList.filter( (item) => {
        return item.msgs.toLowerCase().indexOf(state.valueList.toLowerCase()) !== -1
       })
    },
	computedPersonList: (state) => {
       	return state.personList.filter( (item) => {
        	return item.userid.toLowerCase().indexOf(state.valuePerson.toLowerCase()) !== -1
       })
    },
	computedkmList: (state) => {

       	return state.kmList.filter( (item) => {
        return item.msgs.toLowerCase().indexOf(state.valueList1.toLowerCase()) !== -1
       })
    }
}