import * as tf from '@tensorflow/tfjs';

export async function continuousWaveletTransformUsingTensorFlow(signal: number[], duration: number) {
    var input = tf.tensor1d(signal)
    const morlet_psi_hat = (scale: number, fourier_freqs: tf.Tensor1D, fundamental_freq: number): tf.Tensor1D => {
        return tf.tidy(() => {
            const a: tf.Scalar = tf.scalar(scale);
            const f_0: tf.Scalar = tf.scalar(fundamental_freq);
            const scaleConst: number = Math.pow(Math.PI, 0.25) * Math.pow(2, 0.5);
            const tau: tf.Scalar = tf.scalar(2 * Math.PI);
            return <tf.Tensor1D>tf.sqrt(a.mul(scaleConst).mul(
                tf.exp(tf.scalar(-0.5).mul(tf.square(tau.mul(a.mul(fourier_freqs).sub(f_0)))))));
        });
    };

    const testSignalLength = 2048
    const sigLen = testSignalLength;
    const tau = 2 * Math.PI
    /*
        const testSignal: tf.Tensor1D = tf.tidy(() => {
            const t: tf.Tensor1D = tf.range(0, sigLen / sampleRate, dt);
            const sine1: tf.Tensor1D = t.mul(tau * 220).sin().mul(0.25);
            const sine2: tf.Tensor1D = t.mul(tau * 240).sin().mul(0.125);
            const noiseBurstStartEnd: number[] = [~~(0.75 * sigLen), ~~(0.76 * sigLen)];
            const noiseBurstDuration: number = noiseBurstStartEnd[1] - noiseBurstStartEnd[0];
            const noiseBurst = tf.randomUniform([noiseBurstDuration], -0.5, 0.5);
            const noiseBurstPadded = noiseBurst.pad([[noiseBurstStartEnd[0], sigLen - noiseBurstStartEnd[1]]]);
            return sine1.add(sine2).add(noiseBurstPadded);
        });
    */

    const x_hat: tf.Tensor1D = tf.tidy(() => {
        const signalComplex: tf.Tensor1D = tf.complex(input, input.zerosLike());
        return <tf.Tensor1D>signalComplex.fft();
    });

    // const sampleRate = 8000
    //const dt: number = 1 / sampleRate
    const N: number = x_hat.shape[0];
    const dt: number = duration / 1000 / N
    const df: number = 1 / (N * dt)
    const fourier_freqs: tf.Tensor1D = tf.tidy(() => tf.concat([tf.range(0, N / 2), tf.range(-N / 2, 0)]).mul(df));

    // sliders
    //const f_min = 40, f_max = 4000 // 20..sampleRate/2  Range of frequencies covered by the CWT.
    const f_min = df / 100, f_max = df // 20..sampleRate/2  Range of frequencies covered by the CWT.
    const scales = 256 // 1..480 Frequency resolution.
    const w_0 = 96 // 5.5..144, 0.1 Angular frequency of the mother wavelet (controls time/frequency resolution tradeoff).

    const f_0 = w_0 / (2 * Math.PI)

    const freqs: tf.Tensor1D = tf.tidy(() => {
        const log_f_min = Math.log(f_min);
        const log_f_max = Math.log(f_max);
        const step = (log_f_max - log_f_min) / (scales - 1);
        const log_freqs: tf.Tensor1D = tf.range(0, scales).mul(step).add(log_f_min);
        return log_freqs.exp();
    });

    const a: tf.Tensor1D = tf.tidy(() => {
        const w: tf.Tensor1D = freqs.mul(tau);
        return tf.scalar(w_0).div(w);
    });

    const psi_hat = tf.tidy(() => {
        return tf.concat(a.arraySync().map(aScale => {
            return morlet_psi_hat(aScale, fourier_freqs, f_0).expandDims(0);
        }));
    });

    const a_normalization = tf.tidy(() => a.sqrt().reciprocal().expandDims(1));

    const cwt = tf.tidy(() => x_hat.mul(psi_hat).ifft().mul(a_normalization).abs());

    const normalize01 = (input: tf.Tensor) => tf.tidy(() => {
        const min = input.min();
        const range = input.max().sub(min);
        return input.sub(min).mul(range.reciprocal());
    });

    const scalogram = tf.tidy(() => {
        return normalize01(cwt.log()).reverse(0);
    });

    await tf.browser.toPixels(scalogram as tf.Tensor2D, document.getElementById('testcanvas') as HTMLCanvasElement);

    psi_hat.dispose()
    x_hat.dispose()
    fourier_freqs.dispose()
    a.dispose()
    freqs.dispose()
    //testSignal.dispose();
    a_normalization.dispose();

    scalogram.dispose();

    cwt.dispose()
    input.dispose()

}

type waveletFunction = (points: number[], a: number) => number[]

/**
 * Return a Ricker wavelet, also known as the "Mexican hat wavelet".
 * It models the function:

 ``A * (1 - (x/a)**2) * exp(-0.5*(x/a)**2)``,

 where ``A = 2/(sqrt(3*a)*(pi**0.25))``.

 Parameters
 ----------
 points : int
 Number of points in `vector`.
 Will be centered around 0.
 a : scalar
 Width parameter of the wavelet.

 Returns
 -------
 vector : (N,) ndarray
 Array of length `points` in shape of ricker curve.

 Examples
 --------
 >>> from scipy import signal
 >>> import matplotlib.pyplot as plt

 >>> points = 100
 >>> a = 4.0
 >>> vec2 = signal.ricker(points, a)
 >>> print(len(vec2))
 100
 >>> plt.plot(vec2)
 >>> plt.show()

 """
 */
export const rickerWavelet:  waveletFunction = (points: number[], a: number) => {
    const A = 2 / (Math.sqrt(3 * a) * (Math.PI ** 0.25))
    const wsq = a ** 2
    const vec = points.map((p, index) => index - (p-1.0) / 2)
    const xsq = vec.map(vec => vec ** 2)
    //const mod = xsq.map(xsq => 1 - xsq / wsq)
    return xsq.map(xsq => A * (1 - xsq / wsq) * Math.exp(-xsq / (2 * wsq)))
}

/**
 *
 * @param vector
 * @param widths
 * @param wavelet
 * @param max_distances
 * @param gap_thresh
 * @param min_length
 * @param min_snr
 * @param noise_perc
 * @param window_size
 *    """
 Find peaks in a 1-D array with wavelet transformation.

 The general approach is to smooth `vector` by convolving it with
 `wavelet(width)` for each width in `widths`. Relative maxima which
 appear at enough length scales, and with sufficiently high SNR, are
 accepted.

 Parameters
 ----------
 vector : ndarray
 1-D array in which to find the peaks.
 widths : sequence
 1-D array of widths to use for calculating the CWT matrix. In general,
 this range should cover the expected width of peaks of interest.
 wavelet : callable, optional
 Should take two parameters and return a 1-D array to convolve
 with `vector`. The first parameter determines the number of points
 of the returned wavelet array, the second parameter is the scale
 (`width`) of the wavelet. Should be normalized and symmetric.
 Default is the ricker wavelet.
 max_distances : ndarray, optional
 At each row, a ridge line is only connected if the relative max at
 row[n] is within ``max_distances[n]`` from the relative max at
 ``row[n+1]``.  Default value is ``widths/4``.
 gap_thresh : float, optional
 If a relative maximum is not found within `max_distances`,
 there will be a gap. A ridge line is discontinued if there are more
 than `gap_thresh` points without connecting a new relative maximum.
 Default is the first value of the widths array i.e. widths[0].
 min_length : int, optional
 Minimum length a ridge line needs to be acceptable.
 Default is ``cwt.shape[0] / 4``, ie 1/4-th the number of widths.
 min_snr : float, optional
 Minimum SNR ratio. Default 1. The signal is the value of
 the cwt matrix at the shortest length scale (``cwt[0, loc]``), the
 noise is the `noise_perc`th percentile of datapoints contained within a
 window of `window_size` around ``cwt[0, loc]``.
 noise_perc : float, optional
 When calculating the noise floor, percentile of data points
 examined below which to consider noise. Calculated using
 `stats.scoreatpercentile`.  Default is 10.
 window_size : int, optional
 Size of window to use to calculate noise floor.
 Default is ``cwt.shape[1] / 20``.

 Returns
 -------
 peaks_indices : ndarray
 Indices of the locations in the `vector` where peaks were found.
 The list is sorted.

 See Also
 --------
 cwt
 Continuous wavelet transform.
 find_peaks
 Find peaks inside a signal based on peak properties.

 Notes
 -----
 This approach was designed for finding sharp peaks among noisy data,
 however with proper parameter selection it should function well for
 different peak shapes.

 The algorithm is as follows:
 1. Perform a continuous wavelet transform on `vector`, for the supplied
 `widths`. This is a convolution of `vector` with `wavelet(width)` for
 each width in `widths`. See `cwt`.
 2. Identify "ridge lines" in the cwt matrix. These are relative maxima
 at each row, connected across adjacent rows. See identify_ridge_lines
 3. Filter the ridge_lines using filter_ridge_lines.

 .. versionadded:: 0.11.0

 References
 ----------
 .. [1] Bioinformatics (2006) 22 (17): 2059-2065.
 :doi:`10.1093/bioinformatics/btl355`

 Examples
 --------
 >>> from scipy import signal
 >>> xs = np.arange(0, np.pi, 0.05)
 >>> data = np.sin(xs)
 >>> peakind = signal.find_peaks_cwt(data, np.arange(1,10))
 >>> peakind, xs[peakind], data[peakind]
 ([32], array([ 1.6]), array([ 0.9995736]))

 """
 */
function find_peaks_cwt(vector: number[], widths: number[],
                        wavelet?: waveletFunction,
                        max_distances?: number[],
                        gap_thresh?: number,
                        min_length?: number,
                        min_snr=1,
                        noise_perc=10,
                        window_size?: number)
{

    if (gap_thresh == undefined)
        gap_thresh = Math.ceil(widths[0])
    if (max_distances == undefined)
        max_distances = widths.map(w => w / 4.0)
    if (wavelet == null)
        wavelet = rickerWavelet

    const cwt_dat = cwt(vector, wavelet, widths, window_size)
    const ridge_lines = _identify_ridge_lines(cwt_dat, max_distances, gap_thresh)
    const filtered = _filter_ridge_lines(cwt_dat, ridge_lines, window_size, min_length, min_snr, noise_perc)
    // np.asarray([x[1][0] for x in filtered])
    const max_locs = filtered.map(x => x[1][0])
    max_locs.sort()

    return max_locs
}

/**
 * @returns cwt: (M, N) ndarray  Will have shape of (len(widths), len(data)).
 * @param data
 * @param wavelet
 * @param widths
 * @param window_size
 *     Continuous wavelet transform.

 Performs a continuous wavelet transform on `data`,
 using the `wavelet` function. A CWT performs a convolution
 with `data` using the `wavelet` function, which is characterized
 by a width parameter and length parameter. The `wavelet` function
 is allowed to be complex.

 Parameters
 ----------
 data : (N,) ndarray
 data on which to perform the transform.
 wavelet : function
 Wavelet function, which should take 2 arguments.
 The first argument is the number of points that the returned vector
 will have (len(wavelet(length,width)) == length).
 The second is a width parameter, defining the size of the wavelet
 (e.g. standard deviation of a gaussian). See `ricker`, which
 satisfies these requirements.
 widths : (M,) sequence
 Widths to use for transform.
 dtype : data-type, optional
 The desired data type of output. Defaults to ``float64`` if the
 output of `wavelet` is real and ``complex128`` if it is complex.

 .. versionadded:: 1.4.0

 kwargs
 Keyword arguments passed to wavelet function.

 .. versionadded:: 1.4.0


 Notes
 -----

 .. versionadded:: 1.4.0

 For non-symmetric, complex-valued wavelets, the input signal is convolved
 with the time-reversed complex-conjugate of the wavelet data [1].

 ::

 length = min(10 * width[ii], len(data))
 cwt[ii,:] = signal.convolve(data, np.conj(wavelet(length, width[ii],
 **kwargs))[::-1], mode='same')

 References
 ----------
 .. [1] S. Mallat, "A Wavelet Tour of Signal Processing (3rd Edition)",
 Academic Press, 2009.

 Examples
 --------
 >>> from scipy import signal
 >>> import matplotlib.pyplot as plt
 >>> t = np.linspace(-1, 1, 200, endpoint=False)
 >>> sig  = np.cos(2 * np.pi * 7 * t) + signal.gausspulse(t - 0.4, fc=2)
 >>> widths = np.arange(1, 31)
 >>> cwtmatr = signal.cwt(sig, signal.ricker, widths)
 >>> plt.imshow(cwtmatr, extent=[-1, 1, 1, 31], cmap='PRGn', aspect='auto',
 ...            vmax=abs(cwtmatr).max(), vmin=-abs(cwtmatr).max())
 >>> plt.show()
 */
function cwt(data: number[], wavelet: waveletFunction, widths: number[], window_size?: number): number[][] {
    const output = zeroes2D(widths.length, data.length)
    for (let ind = 0; ind < widths.length; ind++){
        const width = widths[ind];
        let N = Math.min(10 * width, data.length)
        // the conditional block below and the window_size
        // kwarg pop above may be removed eventually; these
        // are shims for 32-bit arch + NumPy <= 1.14.5 to
        // address gh-11095
        if (wavelet == rickerWavelet && window_size == undefined) {
            const ceil = Math.ceil(N)
            if (ceil != N)
                N = Math.floor(N)
        }

/*
        const wavelet_data = np.conj(wavelet(N, width, **kwargs)[::-1])
        output[ind] = convolve(data, wavelet_data, mode='same')
*/
    }
    return output
}

function zeroes2D(rows: number, columns: number): number[][]{
    const result = []
    for (let i = 0; i < rows; i++) {
        result.push(new Array(columns))
        for (let j = 0; j < columns; j++) {
            result[i][j] = 0;
        }
    }
    return result
}

/**
 *
 * @param matr
 * @param max_distances
 * @param gap_thresh
 * """
 Identify ridges in the 2-D matrix.

 Expect that the width of the wavelet feature increases with increasing row
 number.

 Parameters
 ----------
 matr : 2-D ndarray
 Matrix in which to identify ridge lines.
 max_distances : 1-D sequence
 At each row, a ridge line is only connected
 if the relative max at row[n] is within
 `max_distances`[n] from the relative max at row[n+1].
 gap_thresh : int
 If a relative maximum is not found within `max_distances`,
 there will be a gap. A ridge line is discontinued if
 there are more than `gap_thresh` points without connecting
 a new relative maximum.

 Returns
 -------
 ridge_lines : tuple
 Tuple of 2 1-D sequences. `ridge_lines`[ii][0] are the rows of the
 ii-th ridge-line, `ridge_lines`[ii][1] are the columns. Empty if none
 found.  Each ridge-line will be sorted by row (increasing), but the
 order of the ridge lines is not specified.

 References
 ----------
 .. [1] Bioinformatics (2006) 22 (17): 2059-2065.
 :doi:`10.1093/bioinformatics/btl355`

 Examples
 --------
 >>> data = np.random.rand(5,5)
 >>> ridge_lines = _identify_ridge_lines(data, 1, 1)

 Notes
 -----
 This function is intended to be used in conjunction with `cwt`
 as part of `find_peaks_cwt`.


 */
function _identify_ridge_lines(matr: number[][], max_distances: number[], gap_thresh: number) {
    return []

    if(max_distances.length < matr.length)
        throw 'Max_distances must have at least as many rows as matr'

/*
    const all_max_cols = _boolrelextrema(matr, np.greater, axis=1, order=1)
    // Highest row for which there are any relative maxima
    const has_relmax = np.nonzero(all_max_cols.any(axis=1))[0]
    if(has_relmax.length == 0)
        return []
    const start_row = has_relmax[-1]
    // Each ridge line is a 3-tuple:
    // rows, cols,Gap number
    const ridge_lines = [[[start_row], [col], 0] for col in np.nonzero(all_max_cols[start_row])[0]]
    const final_lines = []
    const rows = np.arange(start_row - 1, -1, -1)
    const cols = np.arange(0, matr.shape[1])
    for (const row of rows)
        this_max_cols = cols[all_max_cols[row]]

    // Increment gap number of each line, set it to zero later if appropriate
    for (let line of ridge_lines) {
        line[2] += 1
    }

    // XXX These should always be all_max_cols[row]
    // But the order might be different. Might be an efficiency gain
    // to make sure the order is the same and avoid this iteration
    const prev_ridge_cols = np.array([line[1][-1] for line in ridge_lines])
    // Look through every relative maximum found at current row
    // Attempt to connect them with existing ridge lines.
    for ind, col in enumerate(this_max_cols):
    // If there is a previous ridge line within
    // the max_distance to connect to, do so.
    // Otherwise start a new one.
        line = None
        if(len(prev_ridge_cols) > 0):
        diffs = np.abs(col - prev_ridge_cols)
        closest = np.argmin(diffs)
        if diffs[closest] <= max_distances[row]:
    line = ridge_lines[closest]
    if(line is not None):
    // Found a point close enough, extend current ridge line
    line[1].append(col)
    line[0].append(row)
    line[2] = 0
    else:
    new_line = [[row],
        [col],
        0]
    ridge_lines.append(new_line)

    // Remove the ridge lines with gap_number too high
    // XXX Modifying a list while iterating over it.
    // Should be safe, since we iterate backwards, but
    // still tacky.
        for ind in range(len(ridge_lines) - 1, -1, -1):
    line = ridge_lines[ind]
    if line[2] > gap_thresh:
    final_lines.append(line)
    del ridge_lines[ind]

    out_lines = []
    for line in (final_lines + ridge_lines):
    sortargs = np.array(np.argsort(line[0]))
    rows, cols = np.zeros_like(sortargs), np.zeros_like(sortargs)
    rows[sortargs] = line[0]
    cols[sortargs] = line[1]
    out_lines.append([rows, cols])

    return out_lines
*/
}

/**
 *
 * @param cwt
 * @param ridge_lines
 * @param window_size
 * @param min_length
 * @param min_snr
 * @param noise_perc
 * Filter ridge lines according to prescribed criteria. Intended
 to be used for finding relative maxima.

 Parameters
 ----------
 cwt : 2-D ndarray
 Continuous wavelet transform from which the `ridge_lines` were defined.
 ridge_lines : 1-D sequence
 Each element should contain 2 sequences, the rows and columns
 of the ridge line (respectively).
 window_size : int, optional
 Size of window to use to calculate noise floor.
 Default is ``cwt.shape[1] / 20``.
 min_length : int, optional
 Minimum length a ridge line needs to be acceptable.
 Default is ``cwt.shape[0] / 4``, ie 1/4-th the number of widths.
 min_snr : float, optional
 Minimum SNR ratio. Default 1. The signal is the value of
 the cwt matrix at the shortest length scale (``cwt[0, loc]``), the
 noise is the `noise_perc`th percentile of datapoints contained within a
 window of `window_size` around ``cwt[0, loc]``.
 noise_perc : float, optional
 When calculating the noise floor, percentile of data points
 examined below which to consider noise. Calculated using
 scipy.stats.scoreatpercentile.

 References
 ----------
 .. [1] Bioinformatics (2006) 22 (17): 2059-2065.
 :doi:`10.1093/bioinformatics/btl355`

 */
function _filter_ridge_lines(cwt: number[][], ridge_lines: number[][][], window_size?: number, min_length?: number,
    min_snr=1, noise_perc=10) : number[][][]{
    const num_points = cwt[0].length
    if (min_length == undefined)
        min_length = Math.ceil(cwt.length / 4)
    if (window_size == undefined)
        window_size = Math.ceil(num_points / 20)

    window_size = Math.round(window_size)
    const hf_window = Math.floor(window_size / 2)
    const odd = window_size % 2

    // Filter based on SNR
    const row_one = cwt[0]
    const noises =  new Array(row_one.length).fill(0)
    for (let ind = 0; ind < row_one.length; ind++){
        let val = row_one[ind];
        const window_start = Math.max(ind - hf_window, 0)
        const window_end = Math.min(ind + hf_window + odd, num_points)
        noises[ind] = scoreatpercentile(row_one.slice(window_start, window_end), noise_perc)
    }

    function filt_func(line: number[][]): boolean {
        if (line[0].length < min_length!)
            return false
        const snr = Math.abs(cwt[line[0][0]][line[1][0]] / noises[line[1][0]])
        if (snr < min_snr)
            return false
        return true
    }

    return ridge_lines.filter((line: number[][]) => filt_func(line))

}


/**
 *
 * @param a
 * @param per
 * @param limit
 * @param interpolation_method
 * @param axis
 * Calculate the score at a given percentile of the input sequence.

 For example, the score at `per=50` is the median. If the desired quantile
 lies between two data points, we interpolate between them, according to
 the value of `interpolation`. If the parameter `limit` is provided, it
 should be a tuple (lower, upper) of two values.

 Parameters
 ----------
 a : array_like
 A 1-D array of values from which to extract score.
 per : array_like
 Percentile(s) at which to extract score.  Values should be in range
 [0,100].
 limit : tuple, optional
 Tuple of two scalars, the lower and upper limits within which to
 compute the percentile. Values of `a` outside
 this (closed) interval will be ignored.
 interpolation_method : {'fraction', 'lower', 'higher'}, optional
 Specifies the interpolation method to use,
 when the desired quantile lies between two data points `i` and `j`
 The following options are available (default is 'fraction'):

 * 'fraction': ``i + (j - i) * fraction`` where ``fraction`` is the
 fractional part of the index surrounded by ``i`` and ``j``
 * 'lower': ``i``
 * 'higher': ``j``

 axis : int, optional
 Axis along which the percentiles are computed. Default is None. If
 None, compute over the whole array `a`.

 Returns
 -------
 score : float or ndarray
 Score at percentile(s).

 See Also
 --------
 percentileofscore, numpy.percentile

 Notes
 -----
 This function will become obsolete in the future.
 For NumPy 1.9 and higher, `numpy.percentile` provides all the functionality
 that `scoreatpercentile` provides.  And it's significantly faster.
 Therefore it's recommended to use `numpy.percentile` for users that have
 numpy >= 1.9.

 Examples
 --------
 >>> from scipy import stats
 >>> a = np.arange(100)
 >>> stats.scoreatpercentile(a, 50)
 49.5


 */
function scoreatpercentile(a: number[], per: number, interpolation_method='fraction'){
    const sorted_ = [...a]
    sorted_.sort()
    return _compute_qth_percentile(sorted_, per, interpolation_method)
}

/**
 *
 * @param data
 * @param comparator
 * @param axis int, optional Axis over which to select from `data`. Default is 0.

 * @param order
 * @param mode
 * Calculate the relative extrema of `data`.

 Relative extrema are calculated by finding locations where
 ``comparator(data[n], data[n+1:n+order+1])`` is True.

 Parameters
 ----------
 data : ndarray
 Array in which to find the relative extrema.
 comparator : callable
 Function to use to compare two data points.
 Should take two arrays as arguments.
 order : int, optional
 How many points on each side to use for the comparison
 to consider ``comparator(n,n+x)`` to be True.
 mode : str, optional
 How the edges of the vector are treated. 'wrap' (wrap around) or
 'clip' (treat overflow as the same as the last (or first) element).
 Default 'clip'. See numpy.take.

 Returns
 -------
 extrema : ndarray
 Boolean array of the same shape as `data` that is True at an extrema,
 False otherwise.

 See also
 --------
 argrelmax, argrelmin

 Examples
 --------
 >>> testdata = np.array([1,2,3,2,1])
 >>> _boolrelextrema(testdata, np.greater, axis=0)
 array([False, False,  True, False, False], dtype=bool)


 */
function _boolrelextrema(data: number[][], comparator: (arg0: any, arg1: any) => number, axis=0, order=1, mode='clip'){
    if((Math.floor(order) != order) || (order < 1))
        throw 'Order must be an int >= 1'

    const datalen = axis == 0 ? data.length : data[0].length

    const locs = new Array(datalen).map((_, index) => index)

    // results = np.ones(data.shape, dtype=bool)
    const results = new Array<boolean[]>(data.length)
    for (let i = 0; i < results.length; i++){
        results[i] = new Array<boolean>(data[0].length)
        for (let j = 0; j < results[i].length; j++){
            results[i][j] = true
        }

    }

    const main = take(data, locs, axis, mode)
/*
    for (shift in range(1, order + 1))
        plus = data.take(locs + shift, axis: axis, mode=mode)
        minus = data.take(locs - shift, axis: axis, mode=mode)
        results &= comparator(main, plus)
        results &= comparator(main, minus)
        if(~results.any()):
            return results
*/
    return results
}

function take(data: number[][], indexes:number[], axis: number, mode: string): number[] {
    const result = indexes.length
    if (axis == 0) {
        return []
    }else{
        return []
    }
}

// handle sequence of per's without calling sort multiple times
function _compute_qth_percentile(sorted_: number[], per: number, interpolation_method: string){
/*
    if (!np.isscalar(per))
        score = [_compute_qth_percentile(sorted_, i, interpolation_method) for i in per]
        return np.array(score)

    if not (0 <= per <= 100):
        raise ValueError("percentile must be in the range [0, 100]")

    const indexer = [slice(None)] * sorted_.ndim
    let idx = per / 100. * (sorted_.shape[axis] - 1)

    if int(idx) != idx:
    // round fractional indices according to interpolation method
    if (interpolation_method == 'lower')
        idx = Math.floor(idx)
    else if (interpolation_method == 'higher')
        idx = Math.ceil(idx)
    else if (interpolation_method == 'fraction')
        // keep idx as fraction and interpolate
    else
        throw "interpolation_method can only be 'fraction', 'lower' or 'higher'"

    const i = Math.floor(idx)
    if (i == idx) {
        indexer[axis] = slice(i, i + 1)
        weights = array(1)
        sumval = 1.0
    }else {
        indexer[axis] = slice(i, i + 2)
    }
    j = i + 1
    const weights = array([(j - idx), (idx - i)], float)
    const wshape = [1] * sorted_.ndim
    wshape[axis] = 2
    weights.shape = wshape
    const sumval = weights.sum()

    // Use np.add.reduce (== np.sum but a little faster) to coerce data type
    return np.add.reduce(sorted_[tuple(indexer)] * weights, axis=axis) / sumval
*/
}