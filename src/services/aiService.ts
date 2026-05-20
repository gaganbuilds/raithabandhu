import { mockDb } from '../database/mockDb';

interface AIResult {
  reply: string;
  actionTaken?: 'reminder' | 'activity' | 'price' | 'scheme' | 'general';
}

export const aiService = {
  processFarmingQuery: async (query: string): Promise<AIResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerQuery = query.toLowerCase();

    // Intent: Crop Prices
    if (
      lowerQuery.includes('price') || 
      lowerQuery.includes('bhav') || 
      lowerQuery.includes('rate') || 
      lowerQuery.includes('दाम') || 
      lowerQuery.includes('भाव')
    ) {
      const prices = mockDb.getCropPrices();
      
      if (lowerQuery.includes('wheat') || lowerQuery.includes('gehu') || lowerQuery.includes('गेहूं') || lowerQuery.includes('kanak')) {
        const wheat = prices.find(p => p.id === '1');
        return {
          reply: `खन्ना मंडी (पंजाब) में गेहूं का ताजा भाव ₹${wheat?.price} प्रति क्विंटल है। इसमें ${wheat?.change}% की तेजी है। (Wheat price in Khanna Mandi is ₹${wheat?.price}/quintal, up by ${wheat?.change}%.)`,
          actionTaken: 'price'
        };
      }
      
      if (lowerQuery.includes('paddy') || lowerQuery.includes('dhan') || lowerQuery.includes('धान') || lowerQuery.includes('basmati') || lowerQuery.includes('rice')) {
        const paddy = prices.find(p => p.id === '2');
        return {
          reply: `करनाल मंडी (हरियाणा) में बासमती धान का भाव ₹${paddy?.price} प्रति क्विंटल है। (Basmati Rice price in Karnal Mandi is ₹${paddy?.price}/quintal.)`,
          actionTaken: 'price'
        };
      }

      if (lowerQuery.includes('tomato') || lowerQuery.includes('tamatar') || lowerQuery.includes('टमाटर')) {
        const tomato = prices.find(p => p.id === '5');
        return {
          reply: `कोलार मंडी (कर्नाटक) में टमाटर के भाव में भारी उछाल आया है! आज का रेट ₹${tomato?.price} प्रति क्विंटल है (+${tomato?.change}%). (Tomato price in Kolar is ₹${tomato?.price}/quintal, up by ${tomato?.change}%.)`,
          actionTaken: 'price'
        };
      }

      if (lowerQuery.includes('onion') || lowerQuery.includes('pyaz') || lowerQuery.includes('प्याज')) {
        const onion = prices.find(p => p.id === '6');
        return {
          reply: `लासलगांव मंडी (महाराष्ट्र) में प्याज का भाव ₹${onion?.price} प्रति क्विंटल चल रहा है। आज ${onion?.change}% की मंदी है। (Onion price in Lasalgaon Mandi is ₹${onion?.price}/quintal, down by ${onion?.change}%.)`,
          actionTaken: 'price'
        };
      }

      // Default price response
      return {
        reply: `हमारे पास गेहूं (₹2275), धान (₹4350), कपास (₹7200), सरसों (₹5450) और टमाटर (₹1800) के नवीनतम मंडी भाव उपलब्ध हैं। आप किस फसल के दाम जानना चाहते हैं?`,
        actionTaken: 'price'
      };
    }

    // Intent: Set Reminder
    if (
      lowerQuery.includes('reminder') || 
      lowerQuery.includes('remind') || 
      lowerQuery.includes('याद') || 
      lowerQuery.includes('अलार्म') || 
      lowerQuery.includes('schedule')
    ) {
      let crop = 'General';
      let title = 'Farming activity';
      let type: any = 'General';

      if (lowerQuery.includes('water') || lowerQuery.includes('irrigate') || lowerQuery.includes('sinchai') || lowerQuery.includes('पानी')) {
        title = 'Water the fields';
        type = 'Irrigation';
      } else if (lowerQuery.includes('fertilizer') || lowerQuery.includes('खाद') || lowerQuery.includes('urea')) {
        title = 'Apply fertilizer to crop';
        type = 'Fertilizer';
      } else if (lowerQuery.includes('spray') || lowerQuery.includes('pesticide') || lowerQuery.includes('dawayi') || lowerQuery.includes('दवाई')) {
        title = 'Spray pesticide in field';
        type = 'Pesticides';
      } else if (lowerQuery.includes('harvest') || lowerQuery.includes('katayi') || lowerQuery.includes('कटाई')) {
        title = 'Harvest mature crops';
        type = 'Harvesting';
      }

      // Extract crop name if mentioned
      if (lowerQuery.includes('wheat') || lowerQuery.includes('gehu') || lowerQuery.includes('गेहूं')) crop = 'Wheat';
      else if (lowerQuery.includes('rice') || lowerQuery.includes('paddy') || lowerQuery.includes('dhan')) crop = 'Paddy';
      else if (lowerQuery.includes('cotton') || lowerQuery.includes('kapas') || lowerQuery.includes('कपास')) crop = 'Cotton';
      else if (lowerQuery.includes('tomato') || lowerQuery.includes('tamatar')) crop = 'Tomato';

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      mockDb.addReminder({
        title: `${title} (${crop})`,
        crop,
        date: dateStr,
        time: '07:30',
        type
      });

      return {
        reply: `मैंने कल सुबह 07:30 बजे के लिए "${title} (${crop})" का रिमाइंडर सेट कर दिया है। (I have set a reminder for tomorrow morning 07:30 AM to "${title}".)`,
        actionTaken: 'reminder'
      };
    }

    // Intent: Log Activity
    if (
      lowerQuery.includes('log') || 
      lowerQuery.includes('activity') || 
      lowerQuery.includes('किया') || 
      lowerQuery.includes('spray kiya') || 
      lowerQuery.includes('dala') || 
      lowerQuery.includes('khatam') || 
      lowerQuery.includes('completed')
    ) {
      let type: any = 'crop';
      let title = 'Farming task completed';
      let notes = 'Logged via voice-first helper.';

      if (lowerQuery.includes('water') || lowerQuery.includes('irrigation') || lowerQuery.includes('pani')) {
        title = 'Field Irrigation';
        type = 'water';
        notes = 'Completed irrigation for the main block.';
      } else if (lowerQuery.includes('spray') || lowerQuery.includes('dawayi') || lowerQuery.includes('neem')) {
        title = 'Pest Control Spraying';
        type = 'pest';
        notes = 'Applied insecticide spray to protect crops.';
      } else if (lowerQuery.includes('soil') || lowerQuery.includes('mitti') || lowerQuery.includes('test')) {
        title = 'Soil Sampling';
        type = 'soil';
        notes = 'Collected soil samples for health card verification.';
      } else if (lowerQuery.includes('harvest') || lowerQuery.includes('katayi')) {
        title = 'Crop Harvesting';
        type = 'harvest';
        notes = 'Harvested seasonal crop portion.';
      }

      mockDb.addActivity({
        title,
        notes,
        status: 'Completed',
        type
      });

      return {
        reply: `बधाई हो! आपकी गतिविधि "${title}" को आपकी कृषि टाइमलाइन पर सुरक्षित कर लिया गया है। (Successfully logged activity: "${title}" to your timeline.)`,
        actionTaken: 'activity'
      };
    }

    // Intent: Government Schemes
    if (
      lowerQuery.includes('scheme') || 
      lowerQuery.includes('yojana') || 
      lowerQuery.includes('सरकारी') || 
      lowerQuery.includes('योजना') || 
      lowerQuery.includes('subsidy') || 
      lowerQuery.includes('kcc') || 
      lowerQuery.includes('pension')
    ) {
      if (lowerQuery.includes('kisan credit') || lowerQuery.includes('kcc') || lowerQuery.includes('लोन') || lowerQuery.includes('loan')) {
        return {
          reply: `किसान क्रेडिट कार्ड (KCC) योजना के तहत आपको ₹3 लाख तक का कृषि ऋण मात्र 4% ब्याज पर मिल सकता है। इसकी जानकारी सरकारी योजनाएं पेज पर है। (Under KCC Scheme, get farm loans up to ₹3 Lakh at 4% effective interest.)`,
          actionTaken: 'scheme'
        };
      }
      if (lowerQuery.includes('kisan') || lowerQuery.includes('pm kisan') || lowerQuery.includes('6000') || lowerQuery.includes('६०००')) {
        return {
          reply: `पीएम किसान योजना के तहत सरकार सभी पात्र भूमिधारक किसानों को हर साल ₹6,000 की वित्तीय सहायता तीन किस्तों में देती है। (PM-KISAN scheme offers ₹6,000 yearly in 3 equal installments to eligible landholding farmers.)`,
          actionTaken: 'scheme'
        };
      }
      if (lowerQuery.includes('insurance') || lowerQuery.includes('bima') || lowerQuery.includes('fasal bima') || lowerQuery.includes('बीमा')) {
        return {
          reply: `प्रधानमंत्री फसल बीमा योजना (PMFBY) के तहत रबी फसलों पर 1.5% और खरीफ फसलों पर केवल 2% प्रीमियम देकर आप अपनी फसल का बीमा करा सकते हैं। (PMFBY allows crop insurance with low premiums of 1.5% for Rabi & 2% for Kharif crops.)`,
          actionTaken: 'scheme'
        };
      }
      return {
        reply: `भारत सरकार किसानों के लिए PM-KISAN (₹6000 सहायता), PMFBY (फसल बीमा), Soil Health Card और किसान क्रेडिट कार्ड (कम ब्याज ऋण) योजनाएं चलाती है। आप इनमें से किस योजना के बारे में विस्तार से जानना चाहते हैं?`,
        actionTaken: 'scheme'
      };
    }

    // Default conversational responses
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('namaste') || lowerQuery.includes('नमस्ते')) {
      return {
        reply: `नमस्ते किसान भाई! मैं आपका डिजिटल कृषि सहायक हूँ। आप मुझसे बोलकर या टाइप करके मंडी भाव, मौसम, फसल सुरक्षा, खाद छिड़काव और सरकारी योजनाओं के बारे में पूछ सकते हैं।`,
        actionTaken: 'general'
      };
    }

    return {
      reply: `मुझे आपकी बात समझ में आ गई। आप यह भी बोल सकते हैं: "टमाटर का भाव बताओ", "कल सिंचाई का रिमाइंडर लगाओ", या "सरकारी योजनाएं क्या हैं?"। मैं हमेशा आपकी मदद के लिए तैयार हूँ।`,
      actionTaken: 'general'
    };
  }
};
